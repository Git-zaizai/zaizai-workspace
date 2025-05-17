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
  // 是否开启自动scrollx
  scrollXauto: {
    type: Boolean,
    default: true,
  },
  // 暂时没用
  indexColumnProps: {
    type: [Boolean, Object] as PropType<boolean | DataTableColumn>,
    default: true,
  },
  // 分页
  pagination: {
    type: [Boolean, Object] as PropType<boolean | DataTableProps['pagination']>,
    default: true,
  },
  // 默认操作列
  defaultActionColumn: {
    type: [Boolean, Object] as PropType<boolean | DataTableColumn>,
    default: true,
  },
  // 开启默认隐藏列，table有默认隐藏列传入这个开启默认显示
  columnHides: {
    type: Array as PropType<columnHidesType[]>,
    default: () => [],
  },
  // 是否让表格主体的高度自动适应整个表格区域的高度，打开这个选项会让 table-layout 始终为 'fixed'
  flexHeight: {
    type: Boolean,
    default: true,
  },
  // table右键菜单配置
  dropdownOption: {
    type: Array as PropType<DropdownOption[]>,
    default: () => [],
  }
}

export type ZaiTablePropsType = ExtractPropTypes<typeof zaiTableProps>
