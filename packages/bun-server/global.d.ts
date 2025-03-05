/* 
/// <reference path="./node_modules/@types/bun/index.d.ts" />
 */

import { ServerWebSocket as BunServerWebSocket } from 'bun'
declare interface RouteServerWebSocket extends BunServerWebSocket<{ socketId: string }> {}

declare namespace NodeJS {
  interface Process {
   
  }
  interface ProcessEnv {
    // 端口
    readonly ZAI_PORT: number
    // 路由代理前缀
    readonly ZAI_ROUTER_RPEFIX: string
  }
}
