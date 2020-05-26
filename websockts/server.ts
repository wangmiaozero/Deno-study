/*
 * @Description: 
 * @Version: 1.0
 * @Autor: wangmiao
 * @Date: 2020-05-26 11:38:12
 * @LastEditors: wangmiao
 * @LastEditTime: 2020-05-26 11:56:00
 */ 
import { listenAndServe } from "https://deno.land/std/http/server.ts";
import { acceptWebSocket, acceptable } from "https://deno.land/std/ws/mod.ts";
import { chat } from "./chat.ts";

const options = {
 // hostname: "localhost",
  hostname:'192.168.1.112',
  port: 3000,
 /*  certFile: "./path/to/localhost.crt",
  keyFile: "./path/to/localhost.key", */
};

listenAndServe(options, async (req) => {
  if (req.method === "GET" && req.url === "/") {
    req.respond({
      status: 200,
      headers: new Headers({
        "content-type": "text/html",
      }),
      body: await Deno.open("./index.html"),
    });
  }

  // WebSockets Chat
  if (req.method === "GET" && req.url === "/ws") {
    if (acceptable(req)) {
      acceptWebSocket({
        conn: req.conn,
        bufReader: req.r,
        bufWriter: req.w,
        headers: req.headers,
      }).then(chat);
    }
  }
});

console.log(`Server running on http://${options.hostname}:${options.port}`);
