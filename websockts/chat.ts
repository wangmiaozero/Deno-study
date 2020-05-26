/*
 * @Description: 
 * @Version: 1.0
 * @Autor: wangmiao
 * @Date: 2020-05-26 11:38:12
 * @LastEditors: wangmiao
 * @LastEditTime: 2020-05-26 12:14:31
 */ 
import {
  WebSocket,
  isWebSocketCloseEvent,
} from "https://deno.land/std/ws/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { camelize } from "./camelize.ts";

const users = new Map<string, WebSocket>();

function broadcast(message: string, senderId?: string): void {
  if (!message) return;
  for (const user of users.values()) {
    user.send(senderId ? `[${senderId}]: ${message}` : message);
  }
}

export async function chat(ws: WebSocket): Promise<void> {
  const userId = v4.generate();

  // Register user connection
  users.set(userId, ws);
 // broadcast(`> User with the id ${userId} is connected`);
  broadcast(`用户ID为 ${userId} 已连接`);

  // Wait for new messages
  for await (const event of ws) {
    const message = camelize(typeof event === "string" ? event : "");

    broadcast(message, userId);

    // Unregister user conection
    if (!message && isWebSocketCloseEvent(event)) {
      users.delete(userId);
     // broadcast(`> User with the id ${userId} is disconnected`);
     broadcast(`> 用户ID为 ${userId} 已连接`);
      break;
    }
  }
}
