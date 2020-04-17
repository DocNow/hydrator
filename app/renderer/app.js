import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { ipcRenderer } from 'electron'
import { heartbeat } from './actions/dataset'
import configureStore from './store'
import { createBrowserHistory } from 'history'

import App from './containers/App'

// import './app.global.css';

const history = createBrowserHistory()
const savedStore = ipcRenderer.sendSync('getSavedStore')
console.log("got Store", savedStore)

const store = configureStore(savedStore, history);

// start the heartbeat
setInterval(() => store.dispatch(heartbeat()), 500)

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