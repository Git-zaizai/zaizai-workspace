import { secretkey } from '@/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    info: {
      secretkey: '',
    },
  }),
  actions: {
    async login(value: { un: string; pwd: string }) {
      let response
      try {
        response = await secretkey(value)
        this.info.secretkey = response.data.value.data
        return true
      } catch (e) {
        console.log('error', e)
        response = response.data
        return false
      }
    },
  },
  persist: {
    key: 'zai-info-store',
    pick: ['info'],
  },
})
