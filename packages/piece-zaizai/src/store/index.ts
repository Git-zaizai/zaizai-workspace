import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { getCurrentTheme } from '@/utils/initTheme'
import type { GlobalThemeOverrides } from 'naive-ui'
import { getNaiveThemeOverrides } from '@/utils/color'

export const pinia = createPinia().use(piniaPluginPersistedstate)

interface AnimateMode {
  value: 'zoom-fade' | 'zoom-out' | 'fade-slide' | 'fade' | 'fade-bottom' | 'fade-scale'
  label: string
}

interface State {
  theme: 'light' | 'dark'
  transitionList: AnimateMode[]
  transition: { value: AnimateMode['value']; label: string }
  themeColor: string
  autoTheme: boolean
}

export const appStore = defineStore('appStore', {
  state: (): State => ({
    theme: getCurrentTheme(),
    themeColor: '#18a058',
    autoTheme: false,
    transition: {
      value: 'fade',
      label: '消退',
    },
    transitionList: [
      {
        value: 'zoom-fade',
        label: '渐变',
      },
      {
        value: 'zoom-out',
        label: '闪现',
      },
      {
        value: 'fade-slide',
        label: '滑动',
      },
      {
        value: 'fade',
        label: '消退',
      },
      {
        value: 'fade-bottom',
        label: '底部消退',
      },
      {
        value: 'fade-scale',
        label: '缩放消退',
      },
    ],
  }),
  getters: {
    naiveThemeOverrides(state): GlobalThemeOverrides | null {
      if (state.themeColor === '#18a058') return null
      return getNaiveThemeOverrides(
        {
          primary: state.themeColor,
          info: '#2080f0',
          success: '#18a058',
          warning: '#f0a020',
          error: '#d03050',
        },
        false
      )
    },
  },
  actions: {
    setTransition(value: AnimateMode['value']) {
      this.transition = this.transitionList.find(item => item.value === value)!
    },
  },
  persist: {
    key: 'zai-appStore',
    pick: ['theme', 'transition', 'themeColor', 'autoTheme'],
  },
})
