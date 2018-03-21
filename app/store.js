import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'
import rootReducer from './reducers'
import autosave from './middleware/autosave'

const history = createHistory()

const configureStore = (initialState) => {

  const enhancers = []
  const middleware = [
    routerMiddleware(history),
    thunk,
    autosave
  ]

  /*
  if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.devToolsExtension

    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension())
    }
  }
  */

  const composedEnhancers = composeWithDevTools(
    applyMiddleware(...middleware),
    ...enhancers
  )

  // Create Store
  const store = createStore(rootReducer, initialState, composedEnhancers);

  /*
  if (module.hot) {
    module.hot.accept('./reducers', () =>
      store.replaceReducer(require('./reducers'))); // eslint-disable-line global-require
  }
  */

  return store;
}

export { configureStore, history }
