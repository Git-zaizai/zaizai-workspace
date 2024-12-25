import http from './request'

export const getLinkTabs = () => http('/api/tabs').get().json()
export const getTableData = () => http('/api/table').get().json()
