import Joi, { ValidationOptions } from "joi";
import { Context, Next } from "koa";

type InputSchema = {
    query?: Joi.ObjectSchema
    headers?: Joi.ObjectSchema
    body?: Joi.ObjectSchema
    params?: Joi.ObjectSchema
}

const isKeyOnContext = (key:string) => ['params'].includes(key)

export const validator = (inputSchema: InputSchema, options: ValidationOptions = {}) => (ctx: Context, next: Next) => {

    const validateOptions = {
        ...options,
        context: {
            ...ctx,
            ...options.context
        },
    }
    const keys = Object.keys(inputSchema)
    
    for (const key of keys) {
        
        const targetSchema = inputSchema[key as keyof typeof inputSchema]
        if (!targetSchema) continue

        let source, value: string
        if (isKeyOnContext(key)) {
            source = ctx
            value = ctx[key]
        } else {
            source = ctx.request
            value = ctx.request[key as keyof typeof ctx.request]
        }

        const validatedValue = targetSchema.validate(value, validateOptions)
        if (validatedValue.error) {
            ctx.status = 400
            ctx.body = validatedValue.error.message
            return
        }
    }

    return next()
}