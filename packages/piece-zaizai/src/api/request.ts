import { createFetch } from '@vueuse/core'

const { VITE_GLOB_API_URL, VITE_GLOB_API_URL_PREFIX } = import.meta.env

const http = createFetch({
  baseUrl: VITE_GLOB_API_URL + VITE_GLOB_API_URL_PREFIX,
  fetchOptions: {
    mode: 'cors',
  },
  options: {
    timeout: 6000,
    beforeFetch: ({ options }) => {
      const info = localStorage.getItem('info')
      options.headers['info'] = `Bearer info-${info}`
      return { options }
    },
    afterFetch: ctx => {
      return ctx
    },
    onFetchError: error => {
      console.error('fetch error:', error)
      window.$message.error('网络错误')
      return error
    },
  },
})

export default http
