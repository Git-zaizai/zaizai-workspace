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


// 存储单位换算函数
interface StorageUnit {
  value: number
  unit: string
  bytes: number
}
/**
 * 存储单位换算函数
 * @param bytes - 字节数
 * @param targetUnit - 目标单位（可选，如果不传则自动选择合适单位）
 * @param precision - 精度（小数位数，默认2位）
 * @returns 换算结果对象
 */
export function formatStorageUnit(bytes: number, targetUnit?: string, precision: number = 2): StorageUnit {
  const units = [
    { unit: 'B', bytes: 1 },
    { unit: 'KB', bytes: 1024 },
    { unit: 'MB', bytes: 1024 * 1024 },
    { unit: 'GB', bytes: 1024 * 1024 * 1024 },
    { unit: 'TB', bytes: 1024 * 1024 * 1024 * 1024 },
    { unit: 'PB', bytes: 1024 * 1024 * 1024 * 1024 * 1024 }
  ]
  // 如果指定了目标单位
  if (targetUnit) {
    const unitInfo = units.find(u => u.unit.toUpperCase() === targetUnit.toUpperCase())
    if (!unitInfo) {
      throw new Error(`不支持的目标单位: ${targetUnit}`)
    }
    return {
      value: Number((bytes / unitInfo.bytes).toFixed(precision)),
      unit: unitInfo.unit,
      bytes: bytes
    }
  }
  // 自动选择合适的单位
  for (let i = units.length - 1; i >= 0; i--) {
    const unitInfo = units[i]
    if (bytes >= unitInfo.bytes) {
      return {
        value: Number((bytes / unitInfo.bytes).toFixed(precision)),
        unit: unitInfo.unit,
        bytes: bytes
      }
    }
  }
  // 小于1B的情况
  return {
    value: Number(bytes.toFixed(precision)),
    unit: 'B',
    bytes: bytes
  }
}
/**
 * 格式化存储单位显示字符串
 * @param bytes - 字节数
 * @param targetUnit - 目标单位（可选）
 * @param precision - 精度（默认2位）
 * @returns 格式化后的字符串
 */
export function formatStorageString(bytes: number, targetUnit?: string, precision: number = 2): string {
  const result = formatStorageUnit(bytes, targetUnit, precision)
  return `${result.value} ${result.unit}`
}
/**
 * 从带单位的字符串解析为字节数
 * @param storageString - 例如: "1.5GB", "256MB", "1024KB"
 * @returns 字节数
 */
export function parseStorageString(storageString: string): number {
  const match = storageString.trim().match(/^(\d+(?:\.\d+)?)\s*([KMGT]?B)$/i)
  if (!match) {
    throw new Error(`无效的存储单位格式: ${storageString}`)
  }
  const value = parseFloat(match[1])
  const unit = match[2].toUpperCase()
  
  const units = {
    'B': 1,
    'KB': 1024,
    'MB': 1024 * 1024,
    'GB': 1024 * 1024 * 1024,
    'TB': 1024 * 1024 * 1024 * 1024,
    'PB': 1024 * 1024 * 1024 * 1024 * 1024
  }
  return value * (units[unit as keyof typeof units] || 1)
}