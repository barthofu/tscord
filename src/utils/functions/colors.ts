import { generalConfig } from "@config"
import { ColorResolvable } from "discord.js"


export const getColor = (colorResolver: keyof typeof generalConfig.colors) => {

    return generalConfig.colors[colorResolver] as ColorResolvable
}