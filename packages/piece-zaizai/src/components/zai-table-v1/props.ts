import type { DataTableColumn, DataTableColumns, DataTableProps, DropdownOption, DropdownProps } from 'naive-ui'
import { dataTableProps } from 'naive-ui'
import { ExtractPropTypes, PropType } from 'vue'
import { type columnHidesType } from './enum'

const PickDataTableProps = (key: Array<keyof DataTableProps>) => {
  return key.reduce((prev, curr) => {
    prev[curr] = dataTableProps[curr]
    return prev
  }, {} as Record<string, any>)
}

export type TableRowKey = DataTableProps['rowKey']

export const zaiTableProps = {
  // 继承 naive-ui 的 table props  需要开启
  ...dataTableProps,
  scrollXauto: {
    type: Boolean,
    default: false,
  },
  indexColumnProps: {
    type: [Boolean, Object] as PropType<boolean | DataTableColumn>,
    default: true,
  },
  pagination: {
    type: [Boolean, Object] as PropType<boolean | DataTableProps['pagination']>,
    default: true,
  },
  defaultActionColumn: {
    type: [Boolean, Object] as PropType<boolean | DataTableColumn>,
    default: true,
  },
  columnHides: {
    type: Array as PropType<columnHidesType[]>,
    default: () => [],
  },
  flexHeight: {
    type: Boolean,
    default: true,
  },
  dropdownOption: {
    type: Array as PropType<DropdownOption[]>,
    default: () => [],
  }
}

export type ZaiTablePropsType = ExtractPropTypes<typeof zaiTableProps>
