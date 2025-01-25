// @ts-ignore
import { nanoid } from 'nanoid'
import type { WebSocketHandler, ServerWebSocket } from 'bun'
import { DATA_PATH } from '../config'
import { wsMap } from './const'



const webSocketHandler: WebSocketHandler = {
    open(ws) {
        let socketId = ws.data as string
        if (!socketId) {
            return ws.close(401, 'Invalid socket id')
        }
        if (!wsMap.has(socketId)) {
            wsMap.set(socketId, {
                ws,
                messages: [],
                createDate: Date.now()
            })
        }
    },
    message(ws, message) {
        if (typeof message === 'string' && /^\d{4}$/.test(message)) {

        }

    },
    ping() { },
    pong() { },
    close() { }
}

export default webSocketHandler