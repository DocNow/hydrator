import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import datasets from './datasets'
import settings from  './settings'
import hydrating from './hydrating'
import newDataset from './newDataset'

export default (history) => combineReducers({
  datasets,
  newDataset,
  settings,
  hydrating,
  router: connectRouter(history)
})