import { useThemeVars, type ThemeCommonVars } from 'naive-ui'
import { appStore } from '@/store'

type CssKey = keyof ThemeCommonVars
type Style = Record<string, [string, string]>
type Style2 = Record<string, CssKey>

function convertToKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2') // 找到小写字母后跟大写字母的地方，插入连字符
    .toLowerCase() // 转换为小写
}

/**
 *
 * @param keys
 * @param style [暗色，亮色]
 * @param style2 使用 naive的颜色在自定义名字，防止与 naive的冲突
 * @param css
 * @returns
 */
export const useCssVars = (keys: CssKey[], style?: Style | null, style2?: Style2 | null, css?: CssStyle) => {
  const { theme } = appStore()
  const naiveTheme = useThemeVars()
  const vars = computed(() => {
    let value = {}
    keys.forEach(key => {
      let nvalue = naiveTheme.value[key] as string
      let kvalue = `--zai-${convertToKebabCase(key)}`
      value[kvalue] = nvalue
    })
    if (style) {
      for (const key in style) {
        value[`--zai-${key}`] = theme === 'dark' ? style[key][0] : style[key][1]
      }
    }
    if (style2) {
      for (const key2 in style2) {
        value[`--zai-${key2}`] = naiveTheme.value[style2[key2]]
      }
    }
    value = { ...value, ...css }
    return value
  })

  return vars
}
