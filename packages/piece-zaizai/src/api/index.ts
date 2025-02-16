import http, { queryParams } from './request'

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
export const setJsonFile = (name, value) => http(`/json/set/${name}`).post(value).json()
export const delJsonFile = name => http(`/delete/${name}`).get().json()
export const getJosnList = () => http('/json/list').get().json()

export const secretkey = (data: { un: string; pwd: string }) => http('/secretkey').post(data).json()
export const verifyTest = () => http('/verify').get().json()

export const getLinkTabs = () => http('/link/tags').get().json()
export const getLinkTable = () => http('/link/table').get().json()
export const setLinkItem = (data: any) => http('/link/update-item').post(data).json()
