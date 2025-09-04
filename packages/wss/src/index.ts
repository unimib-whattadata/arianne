import type { UserResponse } from "@supabase/supabase-js";
import type { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import { appRouter, createTRPCContext } from "@arianne/api";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { WebSocketServer } from "ws";

class WebSocketServerSingleton {
  private static instance: WebSocketServer;

  public static getInstance(): WebSocketServer {
    if (!WebSocketServerSingleton.instance) {
      const wssPort = 3005;
      WebSocketServerSingleton.instance = new WebSocketServer({
        port: wssPort,
      });

      const handler = applyWSSHandler({
        wss: WebSocketServerSingleton.instance,
        router: appRouter,
        onError: (err) => {
          console.error("WebSocket error:", err.error);
        },
        createContext: (opts: CreateWSSContextFnOptions) => {
          const { info } = opts;
          const { connectionParams } = info;
          if (!connectionParams?.data) {
            throw new Error("No connectionParams provided");
          }

          const data = JSON.parse(connectionParams.data) as UserResponse;

          const heads = new Headers();
          for (const [key, value] of Object.entries(opts.req.headers)) {
            if (typeof value === "string") {
              heads.set(key, value);
            } else if (Array.isArray(value)) {
              heads.set(key, value.join(", "));
            }
          }
          heads.set("x-trpc-source", "wss");

          return createTRPCContext({
            headers: heads,
            user: data,
          });
        },
      });

      WebSocketServerSingleton.instance.on("connection", (ws) => {
        console.log(
          `➕➕ Connection (${WebSocketServerSingleton.instance.clients.size})`,
        );
        ws.once("close", () => {
          console.log(
            `➖➖ Connection (${WebSocketServerSingleton.instance.clients.size})`,
          );
        });
      });

      WebSocketServerSingleton.instance.on("error", (error) => {
        console.error("WebSocket Server error:", error);
      });

      console.log(`✅ WebSocket Server listening on ws://localhost:${wssPort}`);

      // Gestione della chiusura del server
      process.on("SIGTERM", () => {
        handler.broadcastReconnectNotification();
        WebSocketServerSingleton.instance.close();
        console.log("❌ WebSocket Server closed.");
      });
    }

    return WebSocketServerSingleton.instance;
  }
}

WebSocketServerSingleton.getInstance();
