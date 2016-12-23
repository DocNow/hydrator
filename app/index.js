import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux'
import { ipcRenderer } from 'electron'
import routes from './routes';
import configureStore from './store/configureStore'
import {heartbeat} from './actions/dataset'
import './app.global.css';

const savedStore = ipcRenderer.sendSync('getSavedStore')
console.log("got store", savedStore)

const store = configureStore(savedStore);

const history = syncHistoryWithStore(hashHistory, store);

// start the heartbeat
setInterval(() => store.dispatch(heartbeat()), 1000)

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);
