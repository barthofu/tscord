import * as controllers from "@api/controllers"
import { log } from "@api/middlewares"
import { Logger } from "@services"
import express, { Application } from "express"
import { ClassConstructor, ExpressErrorMiddlewareInterface, getMetadataArgsStorage, IocAdapter, Middleware, useContainer, useExpressServer } from "routing-controllers"
import { routingControllersToSpec } from "routing-controllers-openapi"
import SwaggerUi from "swagger-ui-express"
import { container, DependencyContainer, singleton } from "tsyringe"

@singleton()
export class Server {

    private server: Application

    constructor(
        private readonly logger: Logger
    ) {}

    async start() {

        useContainer(new TsyringeAdapter(container))

        this.server = express()

        this.server.use('/', log)
        this.setupSwaggerUi()

        useExpressServer(this.server, {
            controllers: Object.values(controllers),
            defaultErrorHandler: false
        })

        this.server.listen('4000', this.listen)
    }

    private setupSwaggerUi() {

        const storage = getMetadataArgsStorage()
        const openAPISpec = routingControllersToSpec(storage)
        
        this.server.use('/docs', SwaggerUi.serve, SwaggerUi.setup(openAPISpec))
    }

    async listen() {

    }

}

class TsyringeAdapter implements IocAdapter {

    constructor(
        private readonly TsyringeContainer: DependencyContainer
    ) {}

    get<T>(someClass: ClassConstructor<T>): T {

        const childContainer = this.TsyringeContainer.createChildContainer()
        return childContainer.resolve<T>(someClass)
    }
}

@Middleware({ type: 'after' })
class CustomErrorHandler implements ExpressErrorMiddlewareInterface {

    error(error: any, req: any, res: any, next: (err?: any) => any) {

        res.status(error.httpCode || 500)
        res.json({
            name: error.name,
            message: error.message,
        })
    }
}