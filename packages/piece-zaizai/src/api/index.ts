import http, { queryParams } from './request'
import { wait } from '@/utils'
import dayjs from 'dayjs'

export const getJsonFile = async (value: { name: string; code?: string }) => {
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
  let url = `/json/${value.name}`
  if (value.code) {
    url += '?code=' + value.code
  }
  return http(url).get().json()
}
export const setJsonFile = (name, value) => http(`/json/set/${name}`).post(value).json()
export const delJsonFile = name => http(`/delete/${name}`).get().json()
export const getJosnList = () => http('/json/list').get().json()

export const secretkey = (data: { un: string; pwd: string }) => http('/secretkey').post(data).json()
export const verifyTest = () => http('/verify').get().json()

export const getLinkTabs = () => http('/link/tags').get().json()
export const getLinkTable = () => http('/link/table').get().json()
export const setLinkItem = (data: any) => http('/link/update-item').post(data).json()

export const wsSendMessage = (data: { socketid: string; msg: string }) => http('/ws/test-msg').post(data).json()
export const wsGetReplyMsg = (msg: string) => http('/ws/get-test-msg').post({ msg }).json()

export const getTableData = async () => {
  await wait()
  const resp = new Array(100).fill(0).map((v, i) => {
    return {
      title: 'title' + i,
      start: 0,
      finish: 0,
      duwan: 1,
      tabs: [],
      wanjie: 1,
      isdel: 1,
      link: '',
      linkback: '',
      beizhu: '',
      links: [],
      addDate: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
      update: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
      finishtime: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
      rate: '',
      id: i,
    }
  })
  return {
    value: resp,
  }
}
