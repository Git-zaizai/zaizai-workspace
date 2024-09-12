import type { ConfigProviderProps } from 'naive-ui'
import { createDiscreteApi, darkTheme, lightTheme } from 'naive-ui'
import { appStore } from '@/store'

export const setupNaiveUiDiscreteApi = () => {
  const app = appStore()
  const configProviderPropsRef = computed<ConfigProviderProps>(() => ({
    theme: app.theme === 'light' ? lightTheme : darkTheme,
  }))

  const { message, notification, dialog, loadingBar, modal } = createDiscreteApi(
    ['message', 'dialog', 'notification', 'loadingBar', 'modal'],
    {
      configProviderProps: configProviderPropsRef,
    }
  )

  window.$dialog = dialog
  window.$message = message
  window.$notification = notification
  window.$loadingBar = loadingBar
  window.$modal = modal
}
