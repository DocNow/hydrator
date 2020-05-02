import {v4 as uuidv4} from 'uuid'

import { ADD_DATASET, DELETE_DATASET, START_HYDRATION, STOPPED_HYDRATION, 
         SET_OUTPUT_PATH, UPDATE_PROGRESS, START_CSV_EXPORT, STOP_CSV_EXPORT } 
    from '../actions/dataset'

import { FACTORY_RESET } from '../actions/settings'

function pickDataset(datasets, datasetId) {
  let i = 0;
  for (var d of datasets) {
    if (d.id == datasetId) {
      return { dataset: d, pos: i}
    }
    i += 1
  }
  return null
}

function reducedDatasets(datasets, d) {
   return [
      ...datasets.slice(0, d.pos),
      {...d.dataset},
      ...datasets.slice(d.pos + 1)
    ]
}

export default function dataset(state = [], action) {
  switch (action.type) {

    case ADD_DATASET:
      return [
        {
          id: uuidv4(),
          path: action.path,
          outputPath: null,
          title: action.title,
          creator: action.creator,
          publisher: action.publisher,
          url: action.url,
          hydrating: false,
          numTweetIds: action.numTweetIds,
          idsRead: 0,
          tweetsHydrated: 0,
          completed: null
        },
        ...state
      ] 

    case DELETE_DATASET:
      var d = pickDataset(state, action.datasetId)
      if (d) {
        return [
          ...state.slice(0, d.pos),
          ...state.slice(d.pos + 1)
        ]
      } else {
        return state
      }
     
    case START_HYDRATION:
      // push some of this logic into pickDataset instead of repeating
      var d = pickDataset(state, action.datasetId)
      if (! d.dataset.outputPath) {
        return state
      }
      d.dataset.hydrating = true
      return reducedDatasets(state, d)

    case STOPPED_HYDRATION:
      var d = pickDataset(state, action.datasetId)
      d.dataset.hydrating = false
      return reducedDatasets(state, d)

    case SET_OUTPUT_PATH:
      var d = pickDataset(state, action.datasetId)
      d.dataset.outputPath = action.path
      return reducedDatasets(state, d)

    case UPDATE_PROGRESS:
      var d = pickDataset(state, action.datasetId)
      d.dataset.idsRead += action.idsRead
      d.dataset.tweetsHydrated += action.tweetsHydrated
      if (d.dataset.idsRead >= d.dataset.numTweetIds) {
        d.dataset.completed = new Date()
      }
      return reducedDatasets(state, d)

    case START_CSV_EXPORT: {
      var d = pickDataset(state, action.datasetId)
      if (d) {
        d.dataset.csvExportStarted = true
        d.dataset.csvPath = action.csvPath
        return reducedDatasets(state, d)
      } else {
        return state
      }
    }

    case STOP_CSV_EXPORT: {
      var d = pickDataset(state, action.datasetId)
      if (d) { 
        d.dataset.csvExportStarted = false
        return reducedDatasets(state, d)
      } else {
        return state
      }
    }

    case FACTORY_RESET:
      return []

    default:
      return state;

  }

}