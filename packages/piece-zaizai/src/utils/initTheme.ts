export function isDarkMode(): boolean {
  // 使用matchMedia来检查prefers-color-scheme媒体查询
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  // 如果查询匹配，即用户偏好暗黑模式，则返回true
  return mediaQuery.matches
}

export function isBetweenSevenAndFivePM(): boolean {
  // 获取当前时间
  const now = new Date()
  // 获取当前小时数（0-23）
  const currentHour = now.getHours()

  // 判断是否在7点到17点之间（包括7点和17点）
  return currentHour >= 7 && currentHour <= 17
}

export function getCurrentTheme(): 'light' | 'dark' {
  let appStore: any = localStorage.getItem('zai-appStore')
  if (!appStore) {
    return isDarkMode() ? 'dark' : 'light'
  }

  appStore = JSON.parse(appStore)
  let theme: 'light' | 'dark' = 'dark'

  if (appStore.autoTheme) {
    theme = isBetweenSevenAndFivePM() ? 'dark' : 'light'
  } else {
    theme = appStore.theme ?? 'dark'
  }

  return theme
}
