import { Response } from 'express'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import { Context } from 'koa'

export const error = async (res: Response, message: string, status: StatusCodes) => {

    res.status(status).json({
        error: `${status} ${getReasonPhrase(status)}`,
        message
    })
}

export const ok = async (res: Response, json: any) => {
    
    console.debug(res)
    res.status(StatusCodes.OK).json(json)
}