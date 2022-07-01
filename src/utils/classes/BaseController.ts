import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { Response } from 'koa'

export abstract class BaseController {

    protected error(res: Response, message: string, status: StatusCodes): Response {

        res.status = status
        res.body = {
            error: `${status} ${getReasonPhrase(status)}`,
            message
        }

        return res
    }

    protected ok(res: Response, json: any): Response {

        res.headers['content-type'] = 'application/json'
        res.status = StatusCodes.OK
        res.body = json

        return res
    }
}