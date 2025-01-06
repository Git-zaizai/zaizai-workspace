import dayjs from 'dayjs'


const resp = data => {
  let body
  if (typeof data === 'string') {
    body = data
  } else {
    body = JSON.stringify(data)
  }
  return new Response(body, {
    headers: {
      'content-type': 'application/json',
      'content-length': body.length.toString(),
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'all',
      'Access-Control-Allow-Headers': '*',
    },
  })
}

const wait = () => {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
}

export const route = {
  '/api/tabs': () => {
    return resp(['tab1', 'tab2', 'tab3', 'tab4'])
  },
  '/api/table': async () => {
    const res = new Array(100).fill(null).map((_, i) => {
      return {
        _id: i,
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
        addDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        update: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        finishtime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        rate: '',
        id: 0,
      }
    })

    await wait()
    return resp({
      code: 200,
      data: res,
      msg: 'success',
    })
  },
}
