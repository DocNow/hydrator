import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import datasets from './datasets'
import settings from  './settings'
import hydrating from './hydrating'
import newDataset from './newDataset'

const rootReducer = combineReducers({
  datasets,
  newDataset,
  settings,
  hydrating,
  routing
})

export default rootReducer
