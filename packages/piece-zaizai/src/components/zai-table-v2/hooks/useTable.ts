import { useToggle } from '@vueuse/core'

type Options = {
  refresh: (...args: any[]) => any | Promise<any>
  mount?: boolean
}

export const useTable = <T>(options: Options): ReturnType<typeof useTable> => {
  const { mount = true } = options

  const [loading, toggleLoading] = useToggle(false)
  const data = ref<T[]>([])

  const initRefresh = async () => {
    toggleLoading(true)
    let msg: any
    try {
      const response = await options.refresh()
      if (response) {
        data.value = response.data as T[]
        msg = response.msg || '获取成功'
        window.$message.success(msg)
      } else {
        window.$message.error(msg)
      }
    } catch (error) {
      console.log(error)
      window.$message.error(msg)
    } finally {
      toggleLoading(false)
    }
  }

  onMounted(() => {
    mount && initRefresh()
  })

  return {
    loading,
    toggleLoading,
    data,
    refresh: initRefresh,
  }
}
