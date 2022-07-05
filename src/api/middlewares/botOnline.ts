import axios from "axios"
import { Context, Next } from "koa"

import { apiConfig } from "@config"

export async function botOnline(ctx: Context, next: Next) {

    const { data } = await axios.get(`http://localhost:${apiConfig.port}/health/check`, {
        params: {
            logIgnore: true
        }
    })

    if (data?.online) return next()
}