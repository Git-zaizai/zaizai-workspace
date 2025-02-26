import { isFunction, isObject, isString } from 'lodash-es'

export const isComponent = (component: any) => {
  return (isObject(component) as {}) && isFunction(component.render)
}

export function fullscreen(element) {
  if (!document.fullscreenEnabled) {
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

export function copyStr(value: string): void {
  if (!value) {
    window.$message.warning('没有内容')
    return
  }
  const execCommand = (): void => {
    const el = document.createElement('input')
    el.value = value
    document.body.appendChild(el)
    if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
      el.setSelectionRange(0, value.length)
      el.focus()
    } else {
      el.select()
    }
    if (document.execCommand('copy')) {
      window.$message.success('复制成功')
    } else {
      window.$message.error('复制失败')
    }
    el.blur()
    el.remove()
  }

  if (navigator.clipboard) {
    navigator.clipboard.writeText(value).then(
      function () {
        window.$message.success('复制成功')
      },
      function () {
        execCommand()
      }
    )
  } else {
    execCommand()
  }
}

export function wait(time = 1000) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

export function downloadFile(data: any, filename: string) {
  let str
  if (!isString(data)) {
    str = JSON.stringify(data)
  }
  const blob = new Blob([str])
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
