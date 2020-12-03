import { CHANGE_PLATFORM, GET_PLATFORM } from './types'

const initState = {
  platform: null,
  isNode: typeof global != 'undefined'
}

const platform = (state = initState, action) => {
  switch (action.type) {
    case CHANGE_PLATFORM:
      return {
        ...state,
        platform: action.platform,
        isNode: action.platform === 'node'
      }
    case GET_PLATFORM:
      return {
        isNode: state.isNode
      }
    default:
      return state
  }
}

export default platform