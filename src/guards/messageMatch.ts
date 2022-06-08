import { resolveUser } from "@utils/functions"
import type { ArgsOf, GuardFunction } from "discordx"
  
/**
 * Pass only when the message match with a passed regular expression, Yeah boy
 * @param regex The regex to test
 */
export const MessageMatch = (regex: RegExp) => {

    const guard: GuardFunction<
        | ArgsOf<"messageCreate">
    > = async ([message], client, next) => {
        
        if (message.content.match(regex)) next()
    }

    return guard
}