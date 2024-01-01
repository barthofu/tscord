import { singleton } from "tsyringe"
import { Resource } from "@opentelemetry/resources";
import { B3Propagator } from "@opentelemetry/propagator-b3";
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { SimpleSpanProcessor, BatchSpanProcessor, NodeTracerProvider } from "@opentelemetry/sdk-trace-node";

import { telemetryConfig } from "@configs";

@singleton()
export class Telemetry {
    constructor() {
        // Debugging
        if (telemetryConfig.debug) {
            diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);
        }

        // Resources
        let resourceAttributes: {[ key: string ]: string} = {}
        for (const [key, value] of Object.entries(telemetryConfig.resource) as [keyof typeof telemetryConfig.resource, string][]) {
            resourceAttributes[SemanticResourceAttributes[key]] = value;
        }
        const resource = Resource.default().merge(
            new Resource(resourceAttributes)
        );
        
        // Tracing
        this.initTracing(resource);
    }

    private async initTracing(resource: Resource) {
        // Check if tracing is enabled and that there is at least one exporter
        if (Object.values(telemetryConfig.tracing.enabled).every(v => v === false) || telemetryConfig.tracing.exporters.length === 0) return;

        // Setup provider
        const tracingProvider = new NodeTracerProvider({ resource });

        // Loop through exporters
        for (const exporter of telemetryConfig.tracing.exporters) {
            // Choose processor
            const exporterProcessorClass = exporter.batched ? BatchSpanProcessor : SimpleSpanProcessor;

            // Add processor to provider
            tracingProvider.addSpanProcessor(
                new exporterProcessorClass(
                    exporter.instance,
                    exporter.batchConfig
                )
            );
        }

        // Register provider with propagator
        tracingProvider.register({
            propagator: new B3Propagator()
        });
    }
}