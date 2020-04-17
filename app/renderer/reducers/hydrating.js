import { START_HYDRATION_REQUEST, STOP_HYDRATION_REQUEST } from '../actions/dataset'
import { HYDRATOR_STARTUP, HYDRATOR_SHUTDOWN, FACTORY_RESET } from '../actions/settings'

export default function hydrating(state=false, action) {

    switch (action.type) {

        case START_HYDRATION_REQUEST:
          return true

        case STOP_HYDRATION_REQUEST:
          return false

        case HYDRATOR_STARTUP:
          return false

        case HYDRATOR_SHUTDOWN:
          return false

        default:
          return false

    }

}