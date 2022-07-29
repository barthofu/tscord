import { error, ok } from '@utils/functions'

export abstract class BaseController {

    protected error = error
    protected ok = ok
}