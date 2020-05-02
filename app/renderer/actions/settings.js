import { ipcRenderer } from 'electron'

export const ADD_SETTINGS = 'ADD_SETTINGS'
export const AUTHORIZE = 'AUTHORIZE'
export const SET_PIN = 'SET_PIN'
export const SEND_PIN = 'SET_TWITTER_PIN'
export const INVALID_PIN = 'INVALID_PIN'
export const SET_TWITTER_CREDENTIALS = 'SET_TWITTER_CREDENTIALS'
export const HYDRATOR_STARTUP = 'HYDRATOR_STARTUP'
export const HYDRATOR_SHUTDOWN = 'HYDRATOR_SHUTDOWN'
export const FACTORY_RESET = 'FACTORY_RESET'
export const GET_SAVED_STORE = 'GET_SAVED_STORE'
export const AUTOSAVE = 'AUTOSAVE'

export function authorize() {
  ipcRenderer.send(AUTHORIZE)
  return {
    type: AUTHORIZE
  }
}

export function getTwitterCredentials(pin) {
  const credentials = ipcRenderer.sendSync(SEND_PIN, {pin: pin})
  if (credentials === null) {
    return {
      type: INVALID_PIN
    }
  } else {
    return {
      type: SET_TWITTER_CREDENTIALS,
      twitterAccessKey: credentials.accessTokenKey,
      twitterAccessSecret: credentials.accessTokenSecret
    }
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