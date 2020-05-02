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
export const STOPPED_HYDRATION = 'STOPPED_HYDRATION'
export const FINISH_HYDRATION = 'FINISH_HYDRATION'
export const SET_OUTPUT_PATH = 'SET_OUTPUT_PATH'
export const UPDATE_PROGRESS = 'UPDATE_PROGRESS'
export const SET_RESET_TIME = 'SET_RESET_TIME'
export const START_CSV_EXPORT = 'START_CSV_EXPORT'
export const STOP_CSV_EXPORT = 'STOP_CSV_EXPORT'

import { ipcRenderer } from 'electron'
import { checkTweetIdFile } from '../../utils/twitter'

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
  return function (dispatch, getState) {
    var state = getState()
    var dataset = state.datasets.find(d => d.id == datasetId)

    if (dataset) {

      dispatch({
        type: START_HYDRATION,
        datasetId: datasetId
      })

      ipcRenderer.send(START_HYDRATION, {
        dataset: dataset,
        auth: {
          twitterAccessKey: state.settings.twitterAccessKey,
          twitterAccessSecret: state.settings.twitterAccessSecret
        }
      })

    }
  }
}

export function stopHydration(datasetId) {
  return dispatch => {
    ipcRenderer.send(STOP_HYDRATION, {
      datasetId
    })
  }
}

export function setOutputPath(datasetId, path) {
  return {
    type: SET_OUTPUT_PATH,
    datasetId: datasetId,
    path: path 
  }
}

export function setResetTime(t) {
  return {
    type: SET_RESET_TIME,
    resetTime: t
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
      ipcRenderer.send(START_CSV_EXPORT, {
        datasetId: datasetId,
        jsonPath: dataset.outputPath,
        csvPath: csvPath
      })
    }
  }
}