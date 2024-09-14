import { useThemeVars, type ThemeCommonVars } from 'naive-ui'
import { appStore } from '@/store'

type CssKey = keyof ThemeCommonVars
type Style = Record<string, [string, string]>

function convertToKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2') // 找到小写字母后跟大写字母的地方，插入连字符
    .toLowerCase() // 转换为小写
}

export const useCssVars = (keys: CssKey[], style?: Style) => {
  const { theme } = appStore()
  const naiveTheme = useThemeVars()
  const vars = computed(() => {
    let value = {}
    keys.forEach(key => {
      let nvalue = naiveTheme.value[key] as string
      let kvalue = `--zai-${convertToKebabCase(key)}`
      value[kvalue] = nvalue
    })
    for (const key in style) {
      value[`--zai-${key}`] = theme === 'dark' ? style[key][0] : style[key][1]
    }
    return value
  })

  return vars
}
