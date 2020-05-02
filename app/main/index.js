import fs from 'fs'
import path from 'path'
import readline from 'readline'
import storage from 'electron-json-storage'
import TwitterPinAuth from 'twitter-pin-auth'
import { app, shell, crashReporter, BrowserWindow, Menu, ipcMain } from 'electron'

import { hydrateToStream, toCsv } from '../utils/twitter'
import { GET_SAVED_STORE, SAVE, AUTOSAVE, AUTHORIZE, SEND_PIN } from '../renderer/actions/settings'
import { START_CSV_EXPORT, STOP_CSV_EXPORT, START_HYDRATION, STOP_HYDRATION, STOPPED_HYDRATION, 
         FINISH_HYDRATION, DELETE_DATASET } from '../renderer/actions/dataset'

const isDevelopment = process.env.NODE_ENV === 'development'

let mainWindow = null
let forceQuit = false

const activeHydrators = new Map()
const twitterPinAuth = new TwitterPinAuth("TWITTER_CONSUMER_KEY", "TWITTER_CONSUMER_SECRET")

console.log(`storage location: ${storage.getDefaultDataPath()}`)

const installExtensions = async () => {
  const installer = require('electron-devtools-installer')
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS']
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  for (const name of extensions) {
    try {
      await installer.default(installer[name], forceDownload)
    } catch (e) {
      console.error(`Error installing ${name} extension: ${e.message}`)
    }
  }
}

crashReporter.start({
  productName: 'Hydrator',
  companyName: 'Documenting the Now',
  submitURL: 'https://www.docnow.io/',
  uploadToServer: false,
})

app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('ready', async () => {

  if (isDevelopment) {
    await installExtensions()
  }

  mainWindow = new BrowserWindow({
    width: 500,
    height: 750,
    minWidth: 640,
    minHeight: 480,
    show: false,
    allowRendererProcessReuse: true,
    webPreferences: {
      nodeIntegration: true,
    },
  })

  mainWindow.loadFile(path.resolve(path.join(__dirname, '../renderer/index.html')))

  // show window once on first load
  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.show()
  })

  mainWindow.webContents.on('did-finish-load', () => {
    // Handle window logic properly on macOS:
    // 1. App should not terminate if window has been closed
    // 2. Click on icon in dock should re-open the window
    // 3. ⌘+Q should close the window and quit the app
    if (process.platform === 'darwin') {
      mainWindow.on('close', function(e) {
        if (!forceQuit) {
          e.preventDefault()
          mainWindow.hide()
        }
      })

      app.on('activate', () => {
        mainWindow.show()
      })

      app.on('before-quit', () => {
        forceQuit = true
      })

    } else {
      mainWindow.on('closed', () => {
        mainWindow = null
      })
    }
  })

  ipcMain.on(GET_SAVED_STORE, (event, arg) => {
    storage.get('state', (err, data) => {
      // flag any datasets as not hydrating since we are just starting up
      if (data.datasets) {
        for (const dataset of data.datasets) {
          dataset.hydrating = false
        }
      }
      // unset any active resetTime since it may no longer be relevant
      if (data.settings.resetTime) {
        data.settings.resetTime = null
      }
      event.returnValue = data
    })
  })

  ipcMain.on(SAVE, (event, store) => {
    storage.set('state', store, (error) => {
      if (error) {
        console.error(error)
        throw error
      }
    })
  })

  ipcMain.on(AUTHORIZE, () => {
    twitterPinAuth.requestAuthUrl().
      then(url => {
        shell.openExternal(url)
      }).catch(err => { 
        console.error(err)
      })
  })

  ipcMain.on(SEND_PIN, (event, arg) => {
    twitterPinAuth.authorize(arg.pin)
      .then(credentials => {
        event.returnValue = credentials
      }).catch(err => {
        console.error(err)
        event.returnValue = null
      })
  })

  ipcMain.on(START_CSV_EXPORT, (event, arg) => {
    toCsv(arg.jsonPath, arg.csvPath)
      .then(function() {
        event.sender.send(STOP_CSV_EXPORT, {
          datasetId: arg.datasetId
        })
      })
      .catch(function(err) {
        console.error("error during csv writing", err)
      })
  })

  ipcMain.on(START_HYDRATION, async (event, arg) => {

    // flag this dataset as hydrating
    activeHydrators.set(arg.dataset.id, true)

    // collect together the pieces needed for talking to twitter
    const auth = {
      consumer_key: "TWITTER_CONSUMER_KEY",
      consumer_secret: "TWITTER_CONSUMER_SECRET",
      access_token: arg.auth.twitterAccessKey,
      access_token_secret: arg.auth.twitterAccessSecret,
    }

    // open the input stream of tweet ids
    console.log(`reading from ${arg.dataset.path} for ${arg.dataset.id}`)
    const inputStream = fs.createReadStream(arg.dataset.path)
    const rl = readline.createInterface({
      input: inputStream,
      crlfDelay: Infinity
    })

    // this is the number of ids that have already been hydrated
    let idsAlreadyRead = arg.dataset.idsRead

    // if we've read ids already from the file we need to append
    let outputMode = idsAlreadyRead > 0 ? 'a' : 'w'

    // set up the output stream for the json
    console.log(`writing to ${arg.dataset.outputPath} for ${arg.dataset.id}`)
    const outputStream = fs.createWriteStream(arg.dataset.outputPath, {flags: outputMode})

    // read each line of tweet ids
    let ids = []
    let pos = 0
    let stopped = false

    for await (const line of rl) {
      pos += 1

      // skip through the file if we've hydrated some before
      if (pos < idsAlreadyRead) continue

      // accumulate the tweet ids until there are 100 of them
      ids.push(line.replace(/\n$/, ''))
      if (ids.length == 100) {
        await hydrateToStream(ids, outputStream, auth, event, arg.dataset.id)
        ids = []
      }

      // if we've been told to stop break out of the loop
      if (! activeHydrators.has(arg.dataset.id)) {
        stopped = true
        break
      }

    }

    // hydrate any remaining ids 
    if (ids.length > 0 && ! stopped) {
      await hydrateToStream(ids, outputStream, auth, event, arg.dataset.id)
    }

    // send the appropriate message about whey we stopped
    if (stopped) {
      event.sender.send(STOPPED_HYDRATION, {
        datasetId: arg.dataset.id
      })
    } else {
      event.sender.send(FINISH_HYDRATION, {
        datasetId: arg.dataset.id
      })
    }

    inputStream.close()
    outputStream.close()
  })

  ipcMain.on(STOP_HYDRATION, async (event, arg) => {
    activeHydrators.delete(arg.datasetId)
    event.sender.send(STOPPED_HYDRATION, {datasetId: arg.datasetId})
  })

  ipcMain.on(DELETE_DATASET, (event, arg) => {
    const datasetId = arg.datasetId
    if (activeHydrators.has(datasetId)) {
      activeHydrators.delete(arg.datasetId)
    }
  })

  ipcMain.on(AUTOSAVE, (event, arg) => {
    storage.set('state', arg, (error) => {
      if (error) {
        console.error(error)
        throw error
      }
    })
  })

  if (isDevelopment) {

    // auto-open dev tools
    mainWindow.webContents.openDevTools()

    // add inspect element on right click menu
    mainWindow.webContents.on('context-menu', (e, props) => {

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click() {
            mainWindow.inspectElement(props.x, props.y)
          },
        },
      ]).popup(mainWindow)
    })

  }
})

