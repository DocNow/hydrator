import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { ipcRenderer } from 'electron'
import { createBrowserHistory } from 'history'
import { GET_SAVED_STORE } from  './actions/settings'

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