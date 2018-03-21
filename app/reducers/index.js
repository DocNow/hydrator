// @flow
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import datasets from './datasets'
import settings from  './settings'
import hydrating from './hydrating'
import newDataset from './newDataset'

const rootReducer = combineReducers({
  routing: routerReducer,
  datasets,
  newDataset,
  settings,
  hydrating,
})

export default rootReducer
