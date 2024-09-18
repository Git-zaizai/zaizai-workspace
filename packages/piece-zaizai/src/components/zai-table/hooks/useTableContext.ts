import { useToggle } from '@vueuse/core'
import type { ZaiTablePropsType } from '../props'
import { cloneDeep, isBoolean } from 'lodash-es'
import type { DataTableColumn, DataTableProps } from 'naive-ui'
import { columnDefulatWidth, zaiTableProvideKey, ColumnUID } from '../enum'
import defaultAction from '../components/default-action.vue'

const defaultActionColumn: ZaiTableColumn = {
  key: 'default_action_column',
  title: '操作',
  fixed: 'right',
  width: 150,
  uid: ColumnUID.default_action_column,
  render: (row: any, index: number) => h(defaultAction, { row, index }),
}

export type ZaiTableColumn = DataTableColumn & {
  uid: string | number
}

type ZaiTableInject = Pick<ReturnType<typeof createTableContext>, 'columns' | 'loading' | 'toggleLoading' | 'setfixed'>

export const useTableContext = (): ReturnType<typeof createTableContext> => {
  return inject(zaiTableProvideKey)
}

export const createTableContext = (optinos: ZaiTablePropsType) => {
  const [loading, toggleLoading] = useToggle(false)

  let scrollautoX = 0

  let cacheColumns = []
  const columns = shallowRef<ZaiTableColumn[]>([])

  const initColumns = () => {
    let isselection = true
    optinos.columns.forEach((item, index) => {
      columns.value.push({
        ...item,
        uid: index,
      })
      if (item.type === 'selection') isselection = false
      scrollautoX += getWidth(item)
    })

    if (optinos.indexColumnProps === true) {
      columns.value.unshift({
        title: '序号',
        uid: ColumnUID.index_column,
        width: 70,
        fixed: 'left',
        align: 'center',
        titleAlign: 'center',
        key: 'index_column_key',
        render: (_: any, _columnIndex: number) => _columnIndex,
      } as ZaiTableColumn)
      scrollautoX += 70
    }

    if (isBoolean(optinos.defaultActionColumn) && optinos.defaultActionColumn) {
      columns.value.push(defaultActionColumn)
    } else {
      columns.value.push({
        uid: ColumnUID.default_action_column,
        ...(optinos.defaultActionColumn as DataTableColumn),
      })
    }

    if (isselection) {
      columns.value.unshift({
        type: 'selection',
        uid: ColumnUID.selection,
        width: 40,
        fixed: 'left',
      })
      scrollautoX += 40
    }

    cacheColumns = cloneDeep(columns.value)
    console.log('🚀 ~ initColumns ~ cacheColumns:', cacheColumns)
  }

  const setfixed = (uid: number, value: 'left' | 'right' | undefined) => {
    const col = columns.value.findIndex(item => item.uid === uid)
    columns.value[col].fixed = value
    columns.value = [...columns.value]
  }

  /**
   *
   * @param uid
   * @param value
   * @param index 在原位置【在记录列表中的，不是显示列表中的索引】的索引
   */
  const setColumnShow = (uid: number, value: boolean, index: number) => {
    const newColumns = columns.value
    if (value) {
      // 查找 当前操作的列 之前有多少个隐藏的列
      let hiddens = 0
      cacheColumns.slice(0, index).forEach(fv => {
        let res = newColumns.some(sv => sv.uid === fv.uid)
        if (!res) {
          hiddens++
        }
      })
      let find = cacheColumns[index]

      // 要插入的位置 = 当前操作列的索引 - 之前有多少个隐藏的列
      let newindex = index - hiddens

      // 判断是否在 显示的列表中 是否可以在中间插入
      if (newindex <= 0) {
        newindex = 0
      } else if (newindex >= columns.value.length) {
        newindex = columns.value.length - 1
      }
      columns.value.splice(newindex, 0, find)
      columns.value = [...columns.value]
    } else {
      const col = columns.value.findIndex(item => item.uid === uid)
      if (col !== -1) {
        columns.value.splice(col, 1)
        columns.value = [...columns.value]
      }
    }
  }

  const getCacheColumns = (): ZaiTableColumn[] => {
    return cacheColumns
  }

  const columnsSort = (list: ZaiTableColumn['uid'][]) => {
    // 根据移动后的列表顺序 重新把 columns 赋值回去
    let result = []
    list.forEach(item => {
      let find = columns.value.find(fv => fv.uid === item)
      result.push(find)
    })
    columns.value = result
  }

  initColumns()

  let paginationReactive: DataTableProps['pagination'] = false

  const initPagination = () => {
    if (isBoolean(optinos.pagination) && optinos.pagination) {
      paginationReactive = reactive({
        page: 1,
        pageSize: 10,
        showSizePicker: true,
        pageSizes: [10, 20, 30, 50, 100],
        showQuickJumper: true,
        onChange: (page: number) => {
          // @ts-ignore
          paginationReactive.page = page
        },
        onUpdatePageSize: (pageSize: number) => {
          // @ts-ignore
          paginationReactive.pageSize = pageSize
          // @ts-ignore
          paginationReactive.page = 1
        },
        prefix: ({ itemCount }) => {
          return `共 ${itemCount} 项`
        },
        // @ts-ignore
        ...optinos.pagination,
      })
    }
  }
  initPagination()

  const result = {
    loading,
    toggleLoading,
    setLoading: (value: boolean) => toggleLoading(value),
    columns,
    scrollautoX,
    getCacheColumns,
    setfixed,
    setColumnShow,
    columnsSort,
    paginationReactive,
    deletePopconfirmShow: optinos.deletePopconfirmShow,
  }
  provide(zaiTableProvideKey, result)

  return result
}

const getWidth = (item: DataTableColumn) => {
  let { minWidth, width, maxWidth } = item
  let w = minWidth || width || maxWidth
  w = Number(w)
  return Number.isNaN(w) ? columnDefulatWidth : w
}
