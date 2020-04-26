import path from 'path'
import fs, { WriteStream } from 'fs'
import readline from 'readline'
import { app, shell, crashReporter, BrowserWindow, Menu, ipcMain } from 'electron'
import storage from 'electron-json-storage'
import { toCsv } from '../utils/twitter'

import { GET_SAVED_STORE, SAVE, OPEN_URL } from '../renderer/actions/settings'
import { START_CSV_EXPORT, STOP_CSV_EXPORT, 
         START_HYDRATION, STOP_HYDRATION, STOPPED_HYDRATION, 
         UPDATE_PROGRESS, FINISH_HYDRATION } from '../renderer/actions/dataset'

const isDevelopment = process.env.NODE_ENV === 'development'

let mainWindow = null
let forceQuit = false

const activeHydrators = new Map()

const installExtensions = async () => {
  const installer = require('electron-devtools-installer')
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS']
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  for (const name of extensions) {
    try {
      await installer.default(installer[name], forceDownload)
    } catch (e) {
      console.log(`Error installing ${name} extension: ${e.message}`)
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
      console.log('sending state', JSON.stringify(data, null, 2))
      event.returnValue = data
    })
  })

  ipcMain.on(SAVE, (event, store) => {
    console.log('saving state')
    storage.set('state', store, (error) => {
      if (error) {
        console.log(error)
        throw error
      }
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
        console.log("error during csv writing", err)
      })
  })

  ipcMain.on(OPEN_URL, (event, arg) => {
    shell.openExternal(arg.url)
  })

  ipcMain.on(START_HYDRATION, async (event, arg) => {
    console.log('start hydrating', JSON.stringify(arg))
    activeHydrators.set(arg.dataset.id, true)

    let idsRead = arg.dataset.idsRead
    while (true) {
      if (idsRead >= arg.dataset.numTweetIds) {
        event.sender.send(FINISH_HYDRATION, {
          datasetId: arg.dataset.id
        })
        break
      } else if (! activeHydrators.has(arg.dataset.id)) {
        event.sender.send(STOPPED_HYDRATION, {
          datasetId: arg.dataset.id
        })
        break
      } else {
        idsRead += 100
        event.sender.send(UPDATE_PROGRESS, {
          datasetId: arg.dataset.id,
          idsRead: 100, 
          tweetsHydrated: Math.floor(Math.random() * 100)
        })
        await sleep(1000)
      }

    }

    /*
    var auth = {
      consumer_key: CONSK,
      consumer_secret: CONSS,
      access_token: state.settings.twitterAccessKey,
      access_token_secret: state.settings.twitterAccessSecret,
    }
    
    const inputStream = fs.createReadStream(event.idsPath)
    const rl = readline.createInterface({
      input: inputStream,
      crlfDelay: Infinity
    })

    const outputStream = fs.createWriteStream(event.jsonPath)

    // accumulate 100 ids at a time
    let ids = []
    for await (const line of rl) {
      ids.push(line.replace(/\n$/, ''))
      if (ids.length == 100) {
        const tweets = await hydrate(ids)
        const text = tweets.map(t => JSON.stringify(t)).join('\n')
        outputStream.write(text)
        ids = []
        await sleep(2000)
      }
    }
    */

    // FINISH_HYDRATION

  })

  ipcMain.on(STOP_HYDRATION, async (event, arg) => {
    console.log('stop hydrating: ', JSON.stringify(arg))
    activeHydrators.delete(arg.datasetId)
    event.sender.send(STOPPED_HYDRATION, {datasetId: arg.datasetId})
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

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 