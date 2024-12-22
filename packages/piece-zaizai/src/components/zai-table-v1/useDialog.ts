import { useToggle } from '@vueuse/core'
import { cloneDeep } from 'lodash-es'

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
  resetFormData?: () => T
  addCallback: (value: T) => void
  updateCallback: (item: any, value: T) => void
}

export const useDialog = <T>(options: Optinos<T>) => {
  const [show, showToggle] = useToggle()

  let action = options.action
  const cacheCationTitle = options.actionTitle ?? defaultActionTitle
  const actionTitle = ref(cacheCationTitle[action])

  const cacheFormData = cloneDeep(options.formData)
  const getInitFormData = () => cacheFormData

  const bindAddShow = () => {
    action = 'add'
    actionTitle.value = cacheCationTitle[action]
    options.addCallback && options.addCallback(cloneDeep(cacheFormData))
    showToggle()
  }

  const bandUpdateShow = (value: any) => {
    action = 'update'
    actionTitle.value = cacheCationTitle[action]
    options.updateCallback && options.updateCallback(value, cloneDeep(cacheFormData))
    showToggle()
  }

  return {
    show,
    action,
    showToggle,
    actionTitle,
    bindAddShow,
    bandUpdateShow,
    getInitFormData,
  }
}
