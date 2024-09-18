import type { DataTableColumn, DataTableColumns, DataTableProps } from 'naive-ui'
import { dataTableProps } from 'naive-ui'
import { ExtractPropTypes, PropType } from 'vue'
import { type ColumnUIDTypeKey } from './const'

export type InternalRowData = Record<string, unknown>

const PickDataTableProps = (key: Array<keyof DataTableProps>) => {
  return key.reduce((prev, curr) => {
    prev[curr] = dataTableProps[curr]
    return prev
  }, {} as Record<string, any>)
}

export const zaiTableProps = {
  // 继承 naive-ui 的 table props  需要开启
  ...dataTableProps,
  scrollXauto: {
    type: Boolean,
    default: false,
  },
  indexColumn: {
    type: [Boolean, Object] as PropType<boolean | DataTableColumn>,
    default: true,
  },
  actionColumn: {
    type: [Boolean, Object] as PropType<boolean | DataTableColumn>,
    default: true,
  },
  popconfirmShow: {
    type: Boolean,
    default: true,
  },
  columnHideKeys: {
    type: Array as PropType<ColumnUIDTypeKey[]>,
    default: () => [],
  },
  pagination: {
    type: [Boolean, Object] as PropType<boolean | DataTableProps['pagination']>,
    default: true,
  },
}

export type ZaiTablePropsType = ExtractPropTypes<typeof zaiTableProps>
