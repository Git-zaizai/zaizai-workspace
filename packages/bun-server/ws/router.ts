import { use } from './message'

use('1', () => {
  return 'router test'
})

import { wsMap } from './const'
use('save', (ws, data) => {
  let socketId = ws.data.socketId
  if (wsMap.has(socketId)) {
    return {
      msg: '请先获取身份 socketId'
    }
  }
})
