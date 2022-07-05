import { Context, Next } from "koa"

export function authenticated(ctx: Context, next: Next) {

    if (ctx.headers['authorization'] === `Bearer ${process.env['API_ADMIN_TOKEN']}`) {
        return next()
    }
    
    ctx.status = 401
    ctx.body = {
        error: "Unauthorized"
    }
}