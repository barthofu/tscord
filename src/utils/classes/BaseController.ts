import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import { Response } from 'koa'

export abstract class BaseController {

    protected doError(res, message: string, status: StatusCodes): Response {

        res.status = status
        res.body = {
            error: `${status} ${getReasonPhrase(status)}`,
            message
        }

        return res
    }

    protected ok(res: Response, json: any): Response {

        const serialisedJson: string = JSON.stringify(json)
        res.headers['content-type'] = 'application/json'
        res.status = StatusCodes.OK
        res.body = serialisedJson

        return res
    }
}