
/* 
/// <reference path="./node_modules/@types/bun/index.d.ts" />
 */

import { ServerWebSocket as BunServerWebSocket } from 'bun'
declare interface RouteServerWebSocket extends BunServerWebSocket<{ socketId: string }> {}