import { use } from './message'

use('1', () => {
  return 'router test'
})

import { wsMap } from './const'
use('save', (ws, data) => {
  let socketId = ws.data
})
