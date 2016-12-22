import { ipcRenderer } from 'electron'

// middleware to tell the main electron process to save state after every action

export default store => next => action => {
  let result = next(action)
  ipcRenderer.send('autosave', true)
  return result
}