import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { Context } from 'koa'

export const error = async (ctx: Context, message: string, status: StatusCodes) => {

    ctx.message = message
    ctx.status = status
    ctx.body = {
        error: `${status} ${getReasonPhrase(status)}`,
        message
    }
}

export const ok = async (ctx: Context, json: any) => {
    
    ctx.headers['content-type'] = 'application/json'
    ctx.status = StatusCodes.OK
    ctx.body = json
}