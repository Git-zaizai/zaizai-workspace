export const columnDefulatWidth = 200

export const zaiTableProvideKey = Symbol('zai-table-context')

export const tableDensity = [
  {
    type: 'menu',
    label: '紧凑',
    key: 'small',
  },
  {
    type: 'menu',
    label: '默认',
    key: 'medium',
  },
  {
    type: 'menu',
    label: '宽松',
    key: 'large',
  },
]

export enum ColumnUID {
  'selection' = -1,
  'index_column' = -2,
  'default_action_column' = -3,
}

export type columnHidesType = keyof typeof ColumnUID
// 默认隐藏的列
export const columnHides: columnHidesType[] = ['selection', 'index_column', 'default_action_column']
