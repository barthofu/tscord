import { colorsConfig } from "@config"
import { ColorResolvable } from "discord.js"

export const getColor = (colorResolver: keyof typeof colorsConfig) => {

    return colorsConfig[colorResolver] as ColorResolvable
}