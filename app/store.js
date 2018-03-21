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

  const composedEnhancers = composeWithDevTools(
    applyMiddleware(...middleware),
    ...enhancers
  )

  return createStore(rootReducer, initialState, composedEnhancers);
}

export { configureStore, history }
