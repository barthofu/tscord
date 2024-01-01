import axios from "axios"
import { InternalServerError } from "@tsed/exceptions"
import { Context, Middleware, PlatformContext } from "@tsed/common"

import { apiConfig } from "@configs"
import { traceMiddleware, extractPropagationHeaders } from "@utils/functions"

const baseUrl = `http://127.0.0.1:${apiConfig.port}`

@Middleware()
export class BotOnline {

    async use(@Context() $ctx: PlatformContext) {
        // wrap the execution of the middleware in a span for the current context
        await traceMiddleware(this, $ctx, async (span) => {
            // Send request to '/health/check' endpoint to check if the bot is online
            const { data } = await axios.get(`${baseUrl}/health/check`, {
                params: {
                    // Ignore the logs to avoid spamming the console with useless logs
                    logIgnore: true
                },
                // Pass the span context to the request headers to propagate it
                headers: extractPropagationHeaders(span)
            })
        
            // If the bot is offline, throw an error to stop the request
            if (!data?.online) throw new InternalServerError('Bot is offline')
        });
    }

}