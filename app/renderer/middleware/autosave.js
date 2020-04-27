import { ipcRenderer } from 'electron'
import { AUTOSAVE } from '../actions/settings'

export default store => next => action => {
  const result = next(action)
  ipcRenderer.send(AUTOSAVE, store.getState())
  return result
}
