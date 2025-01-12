import http from './request'

export const getLinkTabs = () => http('/api/tabs').get().json()
export const getTableData = () => http('/api/table').get().json()
export const getJsonFile = async (name: string) => {
  /* const response = await http(`/json/${name}`).get().blob()
  function readBlobAsText(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(reader.error)
      reader.readAsText(blob)
    })
  }
  return readBlobAsText(response.data as unknown as Blob) */
  return http(`/json/${name}`).get().json()
}
