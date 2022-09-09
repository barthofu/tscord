import { BaseController } from "@utils/classes"
import { Get, JsonController } from "routing-controllers"

@JsonController()
export class OtherController extends BaseController {

    @Get('/')
    async status() {

        return 'API server is running'
    }
}