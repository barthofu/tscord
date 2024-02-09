import { parse } from 'stacktrace-parser'

export function getCallerFile(depth: number = 0) {
	const err = new Error('Error')
	const trace = parse(err.stack || '')

	if (!trace[0])
		return

	return trace[depth + 1].file
}
