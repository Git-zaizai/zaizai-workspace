import { useToggle, useDebounceFn } from '@vueuse/core'
import { type DataTableColumns } from 'naive-ui'

const getOtherViewHeight = () => {
  const header: HTMLDivElement = document.querySelector('.n-layout-header')
  const zaiTable: HTMLDivElement = document.querySelector('.zai-table')
  let h = 0

  if (header && !document.fullscreenElement) {
    h += header.offsetHeight
  }
  // @ts-ignore
  h += zaiTable.children[0].offsetHeight

  if (document.querySelector('.console-content-view')) {
    h += 10 * 2
  } else if (document.querySelector('.demo-content-view')) {
    h += 10 * 3
  }
  return h
}

interface Options<T> {
  refresh?: (...args: any[]) => any | Promise<any>
  mount?: boolean
  heigthAuto?: boolean
  data?: T[]
  createColunms?: () => DataTableColumns<any> | Promise<DataTableColumns<any>>
}

export const useTable = <T extends object>(options: Options<T>) => {
  const { mount = true, heigthAuto = true } = options

  const [loading, toggleLoading] = useToggle(false)
  const data = ref(options.data ?? [])
  let cache_data = null

  let columns = shallowRef()
  // let columns = []

  const initColumns = async () => {
    if (options.createColunms) {
      columns.value = await options.createColunms()
      // columns = await options.createColunms()
    }
  }

  const getCacheData = () => cache_data

  const initRefresh = async () => {
    toggleLoading(true)
    try {
      const response = await options.refresh()
      if (response) {
        if (Array.isArray(response)) {
          data.value = response as T[]
          cache_data = JSON.parse(JSON.stringify(response))
        } else if (response.data) {
          data.value = response.data as T[]
          cache_data = JSON.parse(JSON.stringify(response.data))
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      setTimeout(() => {
        toggleLoading(false)
      }, 500)
    }
  }

  const resize = () => {
    const height = window.innerHeight - getOtherViewHeight()
    const zaiTable: HTMLDivElement = document.querySelector('.zai-table .n-data-table')
    if (zaiTable) {
      zaiTable.style.height = `${height}px`
      console.log('debouncedResize')
    }
  }
  const debouncedResize = useDebounceFn(resize, 300)

  onMounted(() => {
    initColumns()
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
    columns,
    getCacheData,
  }
}
