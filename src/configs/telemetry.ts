import { TelemetryConfigType } from "src/utils/types/configs";
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base";

export const telemetryConfig: TelemetryConfigType = {
    // Enable/disable OpenTelemetry debugging (logs)
    debug: false,

    // Resource attributes (metadata)
    resource: {
        SERVICE_NAME: 'tscord',
        SERVICE_VERSION: '0.0.1',
    },

    // Tracing configuration
    tracing: {
        // Enable/disable tracing for services
        enabled: {
            api: false, // Currently only the API service is supported
        },

        // Tracing exporters
        exporters: [
            {
                // Your instance of the exporter (e.g. new ZipkinExporter()) with your own configuration
                instance: new ConsoleSpanExporter(),

                // Use BatchSpanProcessor instead of SimpleSpanProcessor
                // BatchSpanProcessor batches spans before exporting them to the exporter to reduce network overhead
                batched: false,
            },
        ]
    }
}