import { parse } from "stacktrace-parser"

export const getCallerFile = (depth: number = 0) => {

    const err = new Error()
    const trace = parse(err.stack || '')

    if (!trace[0]) return

    return trace[depth + 1].file
}