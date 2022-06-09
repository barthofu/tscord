import type { ArgsOf, GuardFunction } from "discordx"
  
/**
 * Pass only when the message match with a passed regular expression
 * @param regex The regex to test
 */
export const Match = (regex: RegExp) => {

    const guard: GuardFunction<
        | ArgsOf<"messageCreate">
    > = async ([message], client, next) => {
        
        if (message.content.match(regex)) next()
    }

    return guard
}