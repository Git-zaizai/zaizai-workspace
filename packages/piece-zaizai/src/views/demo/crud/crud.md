# CRUD 主要

这个crud主要还是封装了一些hook函数使用，因为需要灵活度所有只封装hook，不需要封装到组件里面去

暂时有怎么多了，在慢慢添加

## useTable

```ts
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
```

## useDialog

```ts 
import { useToggle } from '@vueuse/core'
import { cloneDeep } from 'lodash-es'

import type { Ref } from 'vue'

const defaultActionTitle = {
  update: '修改',
  add: '新增',
}

interface Optinos<T> {
  // 动作
  action?: 'add' | 'update'
  actionTitle?: {
    update: '修改'
    add: '新增'
  }
  formData: T
  // resetFormData?: () => T
  addCallback: (value: T) => void | T | Promise<T>
  updateCallback: (row: any, formData: T) => void | T | Promise<T>
}

export const useDialog = <T>(options: Optinos<T>) => {
  const [show, showToggle] = useToggle()

  let action = options.action ?? 'add'
  const cacheCationTitle = options.actionTitle ?? defaultActionTitle
  const actionTitle = ref(cacheCationTitle[action])

  const getCacheInitFormData = () => cloneDeep(isRef(options.formData) ? options.formData.value : options.formData) as T
  const formData = ref(getCacheInitFormData())

  const bindAddShow = async () => {
    action = 'add'
    actionTitle.value = cacheCationTitle[action]
    if (options.addCallback) {
      const resp = await options.addCallback(getCacheInitFormData())
      if (resp) {
        formData.value = resp
      }
    }
    showToggle()
  }

  const bandUpdateShow = async (value: any) => {
    action = 'update'
    actionTitle.value = cacheCationTitle[action]
    if (options.updateCallback) {
      const resp = await options.updateCallback(value, getCacheInitFormData())
      if (resp) {
        formData.value = cloneDeep(resp)
      }
    }
    showToggle()
  }

  const getAction = () => action
  const setAction = (value: 'add' | 'update') => action = value
  

  return {
    show,
    showToggle,
    actionTitle,
    bindAddShow,
    bandUpdateShow,
    getCacheInitFormData,
    getAction,
    setAction,
    /**
     * 为什么在这里 as Ref<T> ？
     * 因为不在这里 as , IDEA 会提示 下面的报红
     *
     * 如果没有引用 ".pnpm/@vue+shared@3.5.13/node_modules/@vue/shared"，则无法命名 "useDialog" 的推断类型。这很可能不可移植。需要类型注释。
     *
     * 这个是因为 推导不出 useDialog的返回类型，所以需要手动指定
     * 为什么会推导不出是因为
     * formData:T
     * ref的源码
     * export declare function ref<T>(value: T): [T] extends [Ref] ? IfAny<T, Ref<T>, T> : Ref<UnwrapRef<T>, UnwrapRef<T> | T>;
     *
     * 最后会推导出来 formData: [...] extends [...] ? IfAny<...> : Ref<...>
     * 然后就爆红了
     */
    formData: formData as Ref<T>,
  }
}

```