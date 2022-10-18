import { Controller, Get } from "@tsed/common"

import { BaseController } from "@utils/classes"

@Controller('/')
export class OtherController extends BaseController {

    @Get()
    async status() {

        return 'API server is running'
    }
}