import {CONSK, CONSS} from './settings'

export const ADD_DATASET = 'ADD_DATASET'
export const DELETE_DATASET = 'DELETE_DATASET'
export const CHOOSE_FILE = 'CHOOSE_FILE'
export const UNCHOOSE_FILE = 'UNCHOOSE_FILE'
export const START_CHECK_FILE = 'START_CHECK_FILE'
export const STOP_CHECK_FILE = 'STOP_CHECK_FILE'
export const SET_NUM_TWEET_IDS = 'SET_NUM_TWEET_IDS'
export const SET_FILE_CHECK_ERROR = 'SET_FILE_CHECK_ERROR'
export const PREP_DATASET = 'PREP_DATASET'
export const START_HYDRATION = 'START_HYDRATION'
export const STOP_HYDRATION = 'STOP_HYDRATION'
export const SET_OUTPUT_PATH = 'SET_OUTPUT_PATH'
export const UPDATE_PROGRESS = 'UPDATE_PROGRESS'
export const SET_RESET_TIME = 'SET_RESET_TIME'
export const START_HYDRATION_REQUEST = 'START_HYDRATION_REQUEST'
export const STOP_HYDRATION_REQUEST = 'STOP_HYDRATION_REQUEST'
export const START_CSV_EXPORT = 'START_CSV_EXPORT'
export const STOP_CSV_EXPORT = 'STOP_CSV_EXPORT'

import {hydrateTweets, checkTweetIdFile, toCsv} from '../utils/twitter'

export function addDataset(path, numTweetIds, title, creator, publisher, url) {
  return {
    type: ADD_DATASET,
    path: path,
    title: title,
    creator: creator,
    publisher: publisher,
    url: url,
    numTweetIds: numTweetIds
  }
}

export function deleteDataset(datasetId) {
  return {
    type: DELETE_DATASET,
    datasetId: datasetId
  }
}

export function chooseFile(path) {
  return {
    type: CHOOSE_FILE,
    path: path
  }
}

export function unchooseFile() {
  return {
    type: UNCHOOSE_FILE
  }
}

export function checkFile(path) {
  return function(dispatch, getState) {
    dispatch(startCheckFile())
    checkTweetIdFile(path)
      .then(function(numTweetIds) {
        dispatch(setNumTweetIds(numTweetIds))
        dispatch(stopCheckFile())
      })
      .catch(function(error) {
        var {dialog} = require('electron').remote
        dialog.showErrorBox("Tweet ID File Error", error)
        dispatch(setFileCheckError(error))
        dispatch(stopCheckFile())
      })
  }
}

export function startCheckFile() {
  return {
    type: START_CHECK_FILE
  }
}

export function stopCheckFile() {
  return {
    type: STOP_CHECK_FILE
  }
}

export function setNumTweetIds(numTweetIds) {
  return {
    type: SET_NUM_TWEET_IDS,
    numTweetIds: numTweetIds
  }
}

export function setFileCheckError(error) {
  return {
    type: SET_FILE_CHECK_ERROR,
    error: error
  }
}

export function prepDataset(event) {
  var name = event.target.name
  var value = event.target.value
  return {
    type: PREP_DATASET,
    name: name,
    value: value
  }
}

export function startHydration(datasetId) {
  return {
    type: START_HYDRATION,
    datasetId: datasetId
  }
}

export function stopHydration(datasetId) {
  return {
    type: STOP_HYDRATION,
    datasetId: datasetId
  }
}

export function setOutputPath(datasetId, path) {
  return {
    type: SET_OUTPUT_PATH,
    datasetId: datasetId,
    path: path 
  }
}

function startHydrationRequest() {
  return {
    type: START_HYDRATION_REQUEST
  }
}

function stopHydrationRequest() {
  return {
    type: STOP_HYDRATION_REQUEST
  }
}

export function hydrate() {
  return function(dispatch, getState) {
    var state = getState()

    // only one hydration request at a time
    if (state.hydrating) {
      return
    }

    var eligible = state.datasets.filter((d) => d.hydrating == true && ! d.completed)
    if (eligible.length == 0) {
      return
    }

    dispatch(startHydrationRequest())

    var dataset = eligible[0]
    var auth = {
      consumer_key: CONSK,
      consumer_secret: CONSS,
      access_token: state.settings.twitterAccessKey,
      access_token_secret: state.settings.twitterAccessSecret,
    }
    var startLine = dataset.idsRead
    var endLine = startLine + 100
    console.log("hydrating", dataset.path, startLine, endLine) 

    hydrateTweets(dataset.path, dataset.outputPath, auth, startLine, endLine)
      .then(function(result) {
        dispatch(updateProgress(dataset.id, result.idsRead, result.tweetsHydrated))
        dispatch(stopHydrationRequest())
      }).catch(function(err) {
        console.log(err)
        dispatch(setResetTime(err.reset))
        dispatch(stopHydrationRequest())
      })
  }
}

export function heartbeat() {
  return (dispatch, getState) => {
    var state = getState()
    var resetTime = state.settings.resetTime;
    if (resetTime) {
      var currentTime = new Date().getTime() / 1000 
      if (state.settings.resetTime - currentTime > 0) {
        dispatch(hydrate())
      } else {
        dispatch(setResetTime(null))
      }
    } else {
      dispatch(hydrate())
    }
  }
}

export function setResetTime(t) {
  return {
    type: SET_RESET_TIME,
    resetTime: t
  }
}

export function updateProgress(datasetId, idsRead, tweetsHydrated) {
  return {
    type: UPDATE_PROGRESS,
    datasetId: datasetId,
    idsRead: idsRead,
    tweetsHydrated: tweetsHydrated
  }
}

export function startCsvExport(datasetId, csvPath) {
  return {
    type: START_CSV_EXPORT,
    datasetId: datasetId,
    csvPath: csvPath 
  }
}

export function stopCsvExport(datasetId) {
  return {
    type: STOP_CSV_EXPORT,
    datasetId: datasetId
  }
}

export function exportCsv(datasetId, csvPath) {
  return function (dispatch, getState) {
    var state = getState()
    var dataset = state.datasets.find(d => d.id == datasetId)
    if (dataset) {
      dispatch(startCsvExport(datasetId, csvPath))
      toCsv(dataset.outputPath, csvPath)
        .then(function() {
          dispatch(stopCsvExport(datasetId))
        })
        .catch(function(err) {
          console.log("error", err)
          dispatch(stopCsvExport(datasetId))
        })
    }
  }
}
