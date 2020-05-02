import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { ipcRenderer } from 'electron'
import { createBrowserHistory } from 'history'
import { GET_SAVED_STORE } from  './actions/settings'
import { STOP_HYDRATION, STOPPED_HYDRATION, FINISH_HYDRATION, 
         UPDATE_PROGRESS, STOP_CSV_EXPORT, SET_RESET_TIME } from './actions/dataset'

import configureStore from './store'
import App from './containers/App'

const history = createBrowserHistory()
const savedStore = ipcRenderer.sendSync(GET_SAVED_STORE)
const store = configureStore(savedStore, history);

if (module.hot) {
  module.hot.accept()
}

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
)

// listen for some messages from the main process 
// and dispatch appropriate actions to the store
// maybe there's a better place for these but they 
// need access to the store

ipcRenderer.on(STOPPED_HYDRATION, (event, arg) => {
  store.dispatch({
    type: STOPPED_HYDRATION,
    datasetId: arg.datasetId
  })
})

ipcRenderer.on(FINISH_HYDRATION, (event, arg) => {
  store.dispatch({
    type: FINISH_HYDRATION,
    datasetId: arg.datasetId
  })    
})

ipcRenderer.on(UPDATE_PROGRESS, (event, arg) => {
  store.dispatch({
    type: UPDATE_PROGRESS,
    datasetId: arg.datasetId,
    idsRead: arg.idsRead,
    tweetsHydrated: arg.tweetsHydrated
  })
})

ipcRenderer.on(STOPPED_HYDRATION, (event, arg) => {
  store.dispatch({
    type: STOP_HYDRATION,
    datasetId: arg.datasetId
  })
})

ipcRenderer.on(STOP_CSV_EXPORT, (event, arg) => {
  store.dispatch({
    type: STOP_CSV_EXPORT,
    datasetId: arg.datasetId
  })
})

ipcRenderer.on(SET_RESET_TIME, (event, arg) => {
  store.dispatch({
    type: SET_RESET_TIME,
    resetTime: arg.resetTime
  })
})