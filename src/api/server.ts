import '@tsed/swagger';
import bodyParser from "body-parser";
import { singleton } from "tsyringe";
import { PlatformExpress } from "@tsed/platform-express";
import { MikroORM, UseRequestContext } from "@mikro-orm/core";
import { Span, context, propagation, trace } from "@opentelemetry/api";
import { Inject, PlatformAcceptMimesMiddleware, PlatformApplication, PlatformContext } from "@tsed/common";

import { getContextFromHeaders } from "@utils/functions"; // Must be imported before the Log middleware to avoid middleware bypass (yeah idk why)
import { Log } from "@api/middlewares";
import { telemetryConfig } from "@configs";
import * as controllers from "@api/controllers";
import { version as botVersion } from "../../package.json";
import { Database, PluginsManager, Store } from "@services";

@singleton()
export class Server {

    @Inject() app: PlatformApplication
    
    orm: MikroORM

    constructor(
        private pluginsManager: PluginsManager,
        private store: Store,
        db: Database
    ) {
        this.orm = db.orm
    }

    $beforeRoutesInit() {
        
        this.app
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({extended: true}))
            .use(Log)
            .use(PlatformAcceptMimesMiddleware)

        return null
    }

    $onRequest($ctx: PlatformContext) {
        // Check if tracing is enabled
        if (telemetryConfig.tracing.enabled.api) {
            // Extract the context from the headers
            return getContextFromHeaders($ctx, async () => {
                // Start a new span for the current request
                trace.getTracer("api", botVersion).startActiveSpan(`Request - ${$ctx.request.raw.path}`, {
                    attributes: {
                        "resourceType": "api.request"
                    }
                }, (span) => {
                    // Store the span in the tsed context
                    $ctx.set("opentelemetry-root-span", span);
        
                    // Inject the span context into the headers
                    propagation.inject(context.active(), $ctx.request.headers);
                });
            });
        };
    }

    $onResponse($ctx: PlatformContext) {
        // Check if tracing is enabled and if the span exists
        if(telemetryConfig.tracing.enabled.api && $ctx.has("opentelemetry-root-span")) {
            // Get span from the tsed context
            const span: Span = $ctx.get("opentelemetry-root-span");

            // End the span
            span.end();
        }
    }

    @UseRequestContext()
    async start(): Promise<void> {

        const platform = await PlatformExpress.bootstrap(Server, {
            rootDir: __dirname,
            httpPort: parseInt(process.env['API_PORT']) || 4000,
            httpsPort: false,
            acceptMimes: ['application/json'],
            mount: {
                '/': [...Object.values(controllers), ...this.pluginsManager.getControllers()]
            },
            swagger: [
                {
                    path: '/docs',
                    specVersion: '3.0.1'
                }
            ],
            logger: {
                level: 'warn',
                logRequest: false,
                disableRoutesSummary: true
            }
        })

        platform.listen().then(() => {
            
            this.store.update('ready', (e) => ({ ...e, api: true }))
        })
    }
}