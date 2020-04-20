import TwitterPinAuth from 'twitter-pin-auth'

import { ipcRenderer } from 'electron'

export const ADD_SETTINGS = 'ADD_SETTINGS'
export const GET_TWITTER_AUTH_URL = 'GET_TWITTER_AUTH_URL'
export const SET_TWITTER_AUTH_URL = 'SET_TWITTER_AUTH_URL'
export const UNSET_TWITTER_AUTH_URL = 'UNSET_TWITTER_AUTH_URL'
export const SET_TWITTER_PIN = 'SET_TWITTER_PIN'
export const GET_TWITTER_CREDENTIALS = 'GET_TWITTER_CREDENTIALS'
export const SET_TWITTER_CREDENTIALS = 'SET_TWITTER_CREDENTIALS'
export const HYDRATOR_STARTUP = 'HYDRATOR_STARTUP'
export const HYDRATOR_SHUTDOWN = 'HYDRATOR_SHUTDOWN'
export const FACTORY_RESET = 'FACTORY_RESET'
export const SETTINGS_READY = 'SETTINGS_READY'
export const UNSET_SETTINGS_READY = 'UNSET_SETTINGS_READY'
export const CONSK = 'J2Rx3kNtBe1NwTOffGDRtiTnx'
export const CONSS = 'guF3efhWLWrlHkMuOu7Ff4cZk1yhyfjdIjuRfjP0YKS4seRAiR'

const twitterPinAuth = new TwitterPinAuth(CONSK, CONSS)

export function getTwitterAuthUrl() {
  return function(dispatch) {
    twitterPinAuth.requestAuthUrl().
      then(function(url) {
        ipcRenderer.send('openUrl', {url: url})
        // remote.shell.openExternal(url)
        dispatch(setTwitterAuthUrl(url))
        dispatch(settingsReady())
      }).catch(function(err){ 
        console.error(err)
      })
  }
}

export function setTwitterAuthUrl(url) {
  return {
    type: SET_TWITTER_AUTH_URL,
    twitterAuthUrl: url
  }
}

export function unsetTwitterAuthUrl() {
  return {
    type: UNSET_TWITTER_AUTH_URL
  }
}

export function setTwitterPin(pin) {
  return {
    type: SET_TWITTER_PIN,
    twitterPin: pin
  }
}

export function getTwitterCredentials(pin) {
  return function(dispatch) {
    twitterPinAuth.authorize(pin)
      .then(function(credentials) {
        dispatch(setTwitterCredentials(credentials))

      }).catch(function(err) {
        console.error(err)
        dispatch(unsetTwitterAuthUrl())
      })
  }
}

export function setTwitterCredentials(credentials) {
  return {
    type: SET_TWITTER_CREDENTIALS,
    twitterAccessKey: credentials.accessTokenKey,
    twitterAccessSecret: credentials.accessTokenSecret
  }
}

export function hydratorStartup() {
  return {
    type: HYDRATOR_STARTUP
  }
}

export function hydratorShutdown() {
  return {
    type: HYDRATOR_SHUTDOWN
  }
}

export function factoryReset() {
  return {
    type: FACTORY_RESET
  }
}

export function settingsReady() {
  return {
    type: SETTINGS_READY
  }
}

export function unsetSettingsReady() {
  return {
    type: UNSET_SETTINGS_READY
  }
}

