import { isFunction, isObject } from 'lodash-es'

export const isComponent = (component: any) => {
  return (isObject(component) as {}) && isFunction(component.render)
}

export function fullscreen(element) {
  if (document.fullscreenEnabled) {
    return Promise.reject(new Error('全屏模式被禁用'))
  }
  let result = null
  if (element.requestFullscreen) {
    result = element.requestFullscreen()
  } else if (element.mozRequestFullScreen) {
    result = element.mozRequestFullScreen()
  } else if (element.msRequestFullscreen) {
    result = element.msRequestFullscreen()
  } else if (element.webkitRequestFullscreen) {
    result = element.webkitRequestFullScreen()
  }
  return result || Promise.reject(new Error('不支持全屏'))
}

export function cancelFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
    // @ts-ignore
  } else if (document.msExitFullscreen) {
    // @ts-ignore
    document.msExitFullscreen()
    // @ts-ignore
  } else if (document.mozCancelFullScreen) {
    // @ts-ignore
    document.mozCancelFullScreen()
    // @ts-ignore
  } else if (document.webkitExitFullscreen) {
    // @ts-ignore
    document.webkitExitFullscreen()
  }
}
