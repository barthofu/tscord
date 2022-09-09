import { Logger } from "@services"
import express, { Application } from "express"
import { ClassConstructor, getMetadataArgsStorage, IocAdapter, useContainer, useExpressServer } from "routing-controllers"
import { routingControllersToSpec } from "routing-controllers-openapi"
import SwaggerUi from "swagger-ui-express"
import { container, DependencyContainer, singleton } from "tsyringe"
import * as controllers from "./controllers"
import { log } from "./middlewares"

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
            controllers: Object.values(controllers)
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