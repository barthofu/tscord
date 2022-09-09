import { BaseController } from "@utils/classes"
import { Controller, Get } from "routing-controllers"

@Controller()
export class OtherController extends BaseController {

    @Get('/')
    async status() {

        return 'API server is running'
    }
}