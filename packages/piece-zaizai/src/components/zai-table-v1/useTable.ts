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
  }else if (document.querySelector('.demo-content-view')) {
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

  let columns = shallowRef()
  // let columns = []

  const initColumns = async () => {
    if (options.createColunms) {
      columns.value = await options.createColunms()
      // columns = await options.createColunms()
    }
  }

  const initRefresh = async () => {
    toggleLoading(true)
    let msg: any
    try {
      const response = await options.refresh()
      if (response) {
        data.value = response.data as T[]
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
  }
}
