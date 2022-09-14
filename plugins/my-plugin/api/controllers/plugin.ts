import { BaseController } from "@utils/classes"
import { Get, JsonController, UseBefore } from "routing-controllers"
import { pluginMiddleware } from "@api/middlewares/my-plugin"

@JsonController("/plugin")
export class PluginController extends BaseController {
    
    @Get('/name')
    @UseBefore(pluginMiddleware)
    async name() {

        return { name: 'my-plugin' }
    }
}