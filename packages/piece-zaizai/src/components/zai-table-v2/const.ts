export const zaiTableProvideKey = Symbol('zai-table-context')

export const columnDefulatWidth = 200
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

/* export enum ColumnUID {
  'selection' = -1,
  'index_column' = -2,
  'default_action_column' = -3,
}
 */
export const ColumnUID = {
  selection: -1,
  index_column: -2,
  default_action_column: -3,
}
export type ColumnUIDTypeKey = keyof typeof ColumnUID

export const columnHideKeys = Object.keys(ColumnUID)
