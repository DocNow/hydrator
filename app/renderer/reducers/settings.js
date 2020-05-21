import { combineReducers } from 'redux'

import { SET_RESET_TIME } from '../actions/dataset'
import { ADD_SETTINGS, AUTHORIZE, INVALID_PIN, SET_TWITTER_CREDENTIALS, FACTORY_RESET } from '../actions/settings'

export default function settings(state = {}, action) {

  switch (action.type) {

    case ADD_SETTINGS: {
      return {
        ...state,
        twitterAccessKey: state.twitterAccessKey,
        twitterAccessSecret: state.twitterAccessSecret,
        twitterScreenName: state.twitterScreenName,
        authorize: false,
        invalidPin: false
      }
    }

    case AUTHORIZE: {
      return {
        ...state,
        authorize: action.url,
        invalidPin: false
      }
    }

    case INVALID_PIN: {
      return {
        ...state,
        authorize: false,
        invalidPin: true
      }
    }

    case SET_TWITTER_CREDENTIALS: {
      return {
        ...state,
        authorize: false,
        invalidPin: false,
        twitterAccessKey: action.twitterAccessKey,
        twitterAccessSecret: action.twitterAccessSecret,
        twitterScreenName: action.twitterScreenName,
      }
    }

    case SET_RESET_TIME: {
      return {
        ...state,
        resetTime: action.resetTime
      }
    }

    case FACTORY_RESET: {
      return {}
    }

    default: {
      return state
    }

  }

}