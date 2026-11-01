import { onRequestPost as __api_chat_ts_onRequestPost } from "C:\\Users\\achou\\Desktop\\portfolio\\functions\\api\\chat.ts"
import { onRequestGet as __api_health_ts_onRequestGet } from "C:\\Users\\achou\\Desktop\\portfolio\\functions\\api\\health.ts"

export const routes = [
    {
      routePath: "/api/chat",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_chat_ts_onRequestPost],
    },
  {
      routePath: "/api/health",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_health_ts_onRequestGet],
    },
  ]