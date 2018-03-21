import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { ipcRenderer } from 'electron'
import { configureStore, history } from './store'
import { heartbeat } from './actions/dataset'

import App from './containers/App'
import './app.global.css';

const savedStore = ipcRenderer.sendSync('getSavedStore')
console.log("got Store", savedStore)

const store = configureStore(savedStore);

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
  document.getElementById('root')
);
