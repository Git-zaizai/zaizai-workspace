import { createApp } from 'vue'

import App from './App.vue'
createApp(App).mount('#app')

// import AppDist from './App-esm.vue'
// createApp(AppDist).mount('#app')

import chat from './chat/code.vue'
createApp(chat).mount('#app')