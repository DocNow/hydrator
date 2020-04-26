import { HYDRATOR_STARTUP, HYDRATOR_SHUTDOWN } from '../actions/settings'

export default function hydrating(state=false, action) {

    switch (action.type) {

        case HYDRATOR_STARTUP:
          return false

        case HYDRATOR_SHUTDOWN:
          return false

        default:
          return false

    }

}