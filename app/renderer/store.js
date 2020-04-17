import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { connectRouter, routerMiddleware, push } from 'connected-react-router'
import persistState from 'redux-localstorage'
import thunk from 'redux-thunk'

import datasetActions from './actions/dataset'
import settingsActions from './actions/settings'
import datasets from './reducers/datasets'
import settings from  './reducers/settings'
import hydrating from './reducers/hydrating'
import newDataset from './reducers/newDataset'

export default function configureStore(initialState, routerHistory) {
  const router = routerMiddleware(routerHistory)

  const actionCreators = {
    ...datasetActions,
    ...settingsActions,
    push,
  }

  const reducers = {
    router: connectRouter(routerHistory),
    datasets,
    newDataset,
    settings,
    hydrating,
  }

  const middlewares = [thunk, router]

  const composeEnhancers = (() => {
    const compose_ = window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    if (process.env.NODE_ENV === 'development' && compose_) {
      return compose_({ actionCreators })
    }
    return compose
  })()

  const enhancer = composeEnhancers(applyMiddleware(...middlewares), persistState())
  const rootReducer = combineReducers(reducers)

  return createStore(rootReducer, initialState, enhancer)
}