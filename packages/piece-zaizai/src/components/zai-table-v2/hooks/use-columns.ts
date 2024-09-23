import type { DataTableColumn, DataTableColumns, DataTableProps } from 'naive-ui'
export type InternalRowData = Record<string, unknown>

export type ZaiTableColumn<T = InternalRowData> = DataTableColumn<T> & {
  hide?: boolean
}

type ColumnExpand = ZaiTableColumn & {
  uid: number
  checked: boolean
}

type Optinos = {
  columns: ZaiTableColumn[]
}

export const columnDefulatWidth = 200

export const useColumns = () => {
  const columns = shallowRef<ColumnExpand[]>([])
  return { columns }
}
