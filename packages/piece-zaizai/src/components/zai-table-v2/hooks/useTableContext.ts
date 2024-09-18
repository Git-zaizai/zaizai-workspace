import { useToggle } from '@vueuse/core'
import type { ZaiTablePropsType } from '../props'
import { cloneDeep, isBoolean } from 'lodash-es'
import type { DataTableColumn, DataTableProps } from 'naive-ui'
import { columnDefulatWidth, zaiTableProvideKey, ColumnUID } from '../const'

export const useTableContext = (): ReturnType<typeof createTableContext> => {
  return inject(zaiTableProvideKey)
}

export const createTableContext = (data: any) => {
  provide(zaiTableProvideKey, data)
}
