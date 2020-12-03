import { CHANGE_PLATFORM, GET_PLATFORM } from './types'

// 设置 浏览器环境 还是node环境
export function changePlatform (platform) {
  return {
    type: CHANGE_PLATFORM,
    platform
  }
}
export function getPlatform () {
  return {
    type: GET_PLATFORM
  }
}