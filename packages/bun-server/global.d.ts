/* 
/// <reference path="./node_modules/@types/bun/index.d.ts" />
 */

import { ServerWebSocket as BunServerWebSocket } from 'bun'
declare interface RouteServerWebSocket extends BunServerWebSocket<{ socketId: string }> {}

declare namespace NodeJS {
  interface Process {
   
  }
  interface ProcessEnv {
    /** 正在使用的数据库 */
    readonly ZAI_PORT: number
  }
}
