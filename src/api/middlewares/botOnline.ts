import axios from "axios"
import { Context, Next } from "koa"

import { apiConfig } from "@config"

const baseUrl = `http://localhost:${apiConfig.port}`

export async function botOnline(ctx: Context, next: Next) {

    const { data } = await axios.get(`${baseUrl}/health/check`, {
        params: {
            logIgnore: true
        }
    })

    if (data?.online) return next()
}