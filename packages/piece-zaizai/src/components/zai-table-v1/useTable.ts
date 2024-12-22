import { useToggle, useDebounceFn } from '@vueuse/core'
import type { DataTableColumns } from 'naive-ui'

const getOtherViewHeight = () => {
  const header: HTMLDivElement = document.querySelector('.n-layout-header')
  const zaiTable: HTMLDivElement = document.querySelector('.zai-table')
  let h = 0

  if (header) {
    h += header.offsetHeight
  }
  // @ts-ignore
  h += zaiTable.children[0].offsetHeight

  if (document.querySelector('.console-content-view')) {
    h += 10 * 2
  }
  return h
}

type CreateColunm = <T, U>(value: T) => DataTableColumns<U>

interface Options {
  refresh: (...args: any[]) => any | Promise<any>
  mount?: boolean
  heigthAuto?: boolean
  data?: any[]
  createColunm: CreateColunm
}

export const useTable = <T>(options: Options): ReturnType<typeof useTable> => {
  const { mount = true, heigthAuto = true } = options

  const [loading, toggleLoading] = useToggle(false)
  const data = ref<T[]>(options.data ?? [])
  const colunms = shallowRef([])

  const initRefresh = async () => {
    toggleLoading(true)
    let msg: any
    try {
      const response = await options.refresh()
      if (response) {
        data.value = response.data as T[]
        colunms.value = options.createColunm(data.value)
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

  const resize = () => {
    const height = window.innerHeight - getOtherViewHeight()
    const zaiTable: HTMLDivElement = document.querySelector('.zai-table .n-data-table')
    zaiTable.style.height = `${height}px`
  }
  const debouncedResize = useDebounceFn(resize, 50)

  onMounted(() => {
    mount && options.refresh && initRefresh()
    if (heigthAuto) {
      resize()
      window.addEventListener('resize', debouncedResize)
    }
  })

  onUnmounted(() => {
    if (heigthAuto) {
      window.removeEventListener('resize', debouncedResize)
    }
  })

  return {
    loading,
    toggleLoading,
    data,
    refresh: initRefresh,
  }
}
