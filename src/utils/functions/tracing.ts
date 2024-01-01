import { PlatformContext } from "@tsed/common";
import { ROOT_CONTEXT, context, propagation, trace, Span } from "@opentelemetry/api";

import { telemetryConfig } from "@configs";
import { version as botVersion } from "../../../package.json";

export const getContextFromHeaders = ($ctx: PlatformContext, callback: () => Promise<void>): Promise<void> => {
    // If tracing is disabled, run the callback with the root context
    if(!telemetryConfig.tracing.enabled.api) return callback();

    // Extract the context from the headers
    const ctx = propagation.extract(ROOT_CONTEXT, $ctx.request.headers);
    const spanCtx = trace.getSpanContext(ctx);

    // // Run the callback with the context or the root context
    return context.with((spanCtx ? trace.setSpanContext(ROOT_CONTEXT, spanCtx) : ROOT_CONTEXT), callback);
}

export const extractPropagationHeaders = (context: PlatformContext | Span | undefined) => {
    // New map to store the headers
    let contextHeaders: {[key: string]: string | string[]} = {};

    // If tracing is disabled or context is undefined, return the empty object
    if(!telemetryConfig.tracing.enabled.api || typeof(context) === 'undefined') return contextHeaders;

    // If the context is a PlatformContext and not a span
    if(context instanceof PlatformContext) {
        // try with propagation from current headers
        const ctx = propagation.extract(ROOT_CONTEXT, context.request.headers);
        propagation.inject(ctx, contextHeaders);

        // If propagation didn't add any headers, try copying the headers from the request
        if(Object.keys(contextHeaders).length === 0) {
            // Iterate over the propagation's fields and add them to the map if they exist in the request headers
            for(const field of propagation.fields()) {
                // Check if the field exists in the request headers
                if(typeof context.request.headers[field] !== 'undefined') {
                    // Add the field to the map
                    contextHeaders[field] = context.request.headers[field] as string | string[];
                }
            }
        }
    } else {
        // Inject the span context into the headers
        propagation.inject(trace.setSpanContext(ROOT_CONTEXT, context.spanContext()), contextHeaders);
    }

    // Return the map as an object for axios
    return contextHeaders;
}

export const traceMiddleware = (self: Object, $ctx: PlatformContext, callback: (span: Span | undefined) => Promise<void>): Promise<void> => {
    // If tracing is disabled, run the callback with the root context and without a span
    if(!telemetryConfig.tracing.enabled.api) return callback(undefined);

    // Get the context from the headers
    return getContextFromHeaders($ctx, async () => {
        // Create a new span for the middleware
        const span = trace.getTracer("api", botVersion).startSpan(`Middleware - ${self.constructor.name}`, {
            attributes: {
                "resourceType": "api.middleware"
            }
        });

        // Execute the middleware
        await callback(span);

        // End the span at the end of the callback
        span.end();
    });
}
