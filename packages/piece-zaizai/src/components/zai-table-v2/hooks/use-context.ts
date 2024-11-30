import { useColumns } from './use-columns'

const ColumnInjectKey = Symbol('zai-column')

// 封装这个就是为了 限制使用 ，居然限制只能按照这个方式使用

type KeyType = typeof ColumnInjectKey

type ResUseContext = {
  KeyType: ReturnType<typeof useColumns>
}

export const useContext = (key: KeyType) => {
  return inject(key)
}

export const createContext = (key: symbol, value: any) => {
  provide(key, value)
}
