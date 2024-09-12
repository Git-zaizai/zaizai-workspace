import { createApp } from 'vue'
import App from './App.vue'
import { pinia } from '@/store'
import { router } from '@/router'
import { setupNaiveUiDiscreteApi } from './plugins/naive-ui'

import './plugins/import'

const mian = () => {
  const app = createApp(App)

  app.use(pinia)

  setupNaiveUiDiscreteApi()

  app.use(router)

  app.mount('#app')
}

mian()
