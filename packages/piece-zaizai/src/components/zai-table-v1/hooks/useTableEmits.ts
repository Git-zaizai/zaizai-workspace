import type { EmitFn } from 'vue'
import type { DataTableRowKey } from 'naive-ui'

export const zaiTableEmitProvideKey = Symbol('zai-table-emit')

export type ZaiTableEmitType = {
  actionUpdate: [row: any, index: number, ...args: any[]]
  actionDelete: [row: any, index: number, ...args: any[]]
  refresh: []
  checkedRows: [row: DataTableRowKey[]]
  selectChanga: [value: string]
  add: []
  del: [value: DataTableRowKey[]]
}

export const useTableEmits = (): EmitFn<ZaiTableEmitType> => {
  return inject(zaiTableEmitProvideKey)
}

export const createTableEmitContext = (emits: any) => {
  provide(zaiTableEmitProvideKey, emits)
}
