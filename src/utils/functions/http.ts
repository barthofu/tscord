import { Response } from 'express'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import { Context } from 'koa'
import { HttpError } from 'routing-controllers'

export const throwError = (error: HttpError) => {

    delete error.stack
    throw error
}