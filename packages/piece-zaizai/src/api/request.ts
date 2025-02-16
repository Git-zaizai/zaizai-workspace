import { createFetch } from '@vueuse/core'
import { useUserStore } from '@/store/user'

const { VITE_GLOB_API_URL, VITE_GLOB_API_URL_PREFIX } = import.meta.env

function errorMessage(text: any, status: number) {
  if (typeof text === 'string') {
    window.$message.error(`${status}：${text}`)
  } else {
    window.$message.error(`${status}：${text?.msg ?? ''}`)
  }
}

const http = createFetch({
  baseUrl: VITE_GLOB_API_URL + VITE_GLOB_API_URL_PREFIX,
  fetchOptions: {
    mode: 'cors',
  },
  options: {
    timeout: 6000,
    beforeFetch: ({ url, options }) => {
      const userstore = useUserStore()
      if (userstore.info.secretkey) {
        options.headers['Authorization'] = userstore.info.secretkey
      }
      return { url, options }
    },
    afterFetch: ctx => {
      return ctx
    },
    onFetchError: async error => {
      const errStatus = error?.response?.status ?? 500
      let text = null
      try {
        text = await error.response.json()
      } catch {
        try {
          text = await error.response.text()
        } catch {
          text = '网络错误'
        }
      }

      switch (errStatus) {
        case 401:
          errorMessage(text, errStatus)
          break
        case 404:
          window.$message.error('404 Not Found！')
          break
          break
        default:
          errorMessage(text, errStatus)
          break
      }

      return error
    },
  },
})

export function queryParams(value: Record<string, string | number>) {
  const params = new URLSearchParams(
    Object.entries(value).reduce((acc, [key, val]) => {
      acc[key] = String(val)
      return acc
    }, {} as Record<string, string>)
  ).toString()
  return params
}

export default http
