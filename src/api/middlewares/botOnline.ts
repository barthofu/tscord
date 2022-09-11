import axios from "axios"

import { apiConfig } from "@config"
import { NextFunction, Request, Response } from "express"

const baseUrl = `http://localhost:${apiConfig.port}`

export async function botOnline(req: Request, res: Response, next: NextFunction) {

    const { data } = await axios.get(`${baseUrl}/health/check`, {
        params: {
            logIgnore: true
        }
    })

    if (data?.online) next()
}