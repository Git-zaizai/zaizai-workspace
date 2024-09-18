import { useToggle } from '@vueuse/core'
import type { ZaiTablePropsType } from '../props'
import { cloneDeep, isBoolean } from 'lodash-es'
import type { DataTableColumn, DataTableProps } from 'naive-ui'
import { columnDefulatWidth, zaiTableProvideKey, ColumnUID } from '../const'
import defaultAction from '../components/default-action.vue'

const defaultActionColumn: ZaiTableColumn = {
  key: 'default_action_column',
  title: '操作',
  fixed: 'right',
  width: 150,
  uid: ColumnUID.default_action_column,
  checked: true,
  render: (row: any, index: number) => h(defaultAction, { row, index }),
}

const defaultIndexColumn: ZaiTableColumn = {
  title: '序号',
  uid: ColumnUID.index_column,
  width: 70,
  fixed: 'left',
  align: 'center',
  titleAlign: 'center',
  key: 'index_column_key',
  checked: true,
  render: (_: any, _columnIndex: number) => _columnIndex,
}

const defaultSelectionColumn: ZaiTableColumn = {
  type: 'selection',
  uid: ColumnUID.selection,
  width: 40,
  fixed: 'left',
  checked: true,
}

export type ZaiTableColumn = DataTableColumn & {
  uid: string | number
  checked: boolean
}

export const useColumns = (optinos: ZaiTablePropsType) => {
  let scrollautoX = 0

  const columnSwitchShow = ref({
    selection: false,
    index_column: false,
    default_action_column: false,
  })

  let cacheColumns = []
  const columns = shallowRef<ZaiTableColumn[]>([])

  const initColumns = () => {
    let isselection = true
    let list: ZaiTableColumn[] = []
    optinos.columns.forEach((item, index) => {
      list.push({
        ...item,
        uid: index,
        checked: true,
      })
      if (item.type === 'selection') isselection = false
      scrollautoX += getWidth(item)
    })

    if (optinos.indexColumn === true) {
      list.unshift(defaultIndexColumn)
      scrollautoX += defaultIndexColumn.width as number
    }

    let isAction = isBoolean(optinos.actionColumn)
    if (isAction && optinos.actionColumn) {
      list.push(defaultActionColumn)
      scrollautoX += defaultActionColumn.width as number
    } else if (!isAction) {
      list.push({
        uid: ColumnUID.default_action_column,
        checked: true,
        ...(optinos.actionColumn as DataTableColumn),
      })
      scrollautoX += getWidth(optinos.actionColumn as DataTableColumn)
    }

    if (isselection) {
      list.unshift(defaultSelectionColumn)
      scrollautoX += defaultSelectionColumn.width as number
    }

    cacheColumns = cloneDeep(list)

    optinos.columnHideKeys.forEach(key => {
      if (columnSwitchShow.value[key]) {
        columnSwitchShow.value[key] = true
      }
    })
  }
}

const getWidth = (item: DataTableColumn) => {
  let { minWidth, width, maxWidth } = item
  let w = minWidth || width || maxWidth
  w = Number(w)
  return Number.isNaN(w) ? columnDefulatWidth : w
}
