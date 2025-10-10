import { onRequestGet as __api_auth_ts_onRequestGet } from "/Users/verlyn13/Development/personal/liteckyeditingservices/functions/api/auth.ts"
import { onRequestGet as __api_callback_ts_onRequestGet } from "/Users/verlyn13/Development/personal/liteckyeditingservices/functions/api/callback.ts"
import { onRequestOptions as __api_contact_ts_onRequestOptions } from "/Users/verlyn13/Development/personal/liteckyeditingservices/functions/api/contact.ts"
import { onRequestPost as __api_contact_ts_onRequestPost } from "/Users/verlyn13/Development/personal/liteckyeditingservices/functions/api/contact.ts"
import { onRequest as __admin___path___ts_onRequest } from "/Users/verlyn13/Development/personal/liteckyeditingservices/functions/admin/[[path]].ts"

export const routes = [
    {
      routePath: "/api/auth",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_auth_ts_onRequestGet],
    },
  {
      routePath: "/api/callback",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_callback_ts_onRequestGet],
    },
  {
      routePath: "/api/contact",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_contact_ts_onRequestOptions],
    },
  {
      routePath: "/api/contact",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_contact_ts_onRequestPost],
    },
  {
      routePath: "/admin/:path*",
      mountPath: "/admin",
      method: "",
      middlewares: [],
      modules: [__admin___path___ts_onRequest],
    },
  ]