import { Context, Middleware, PlatformContext } from "@tsed/common"
import { BadRequest, Unauthorized } from "@tsed/exceptions"
import DiscordOauth2 from "discord-oauth2"

import { Store } from "@services"
import { isDev, resolveDependency } from "@utils/functions"

const discordOauth2 = new DiscordOauth2()

const timeout = 10 * 60 * 1000
const fmaTokenRegex = /mfa\.[\w-]{84}/
const nonFmaTokenRegex = /[\w-]{24}\.[\w-]{6}\.[\w-]{27}/

@Middleware()
export class Authenticated {

    private store: Store

    constructor() {
        resolveDependency(Store).then((store) => {
            this.store = store
        })
    }

    use(@Context() { request }: PlatformContext) {

        // if we are in development mode, we don't need to check the token
        // if (process.env['NODE_ENV'] === 'development') return next()

        // check if the request includes valid authorization header
        const authHeader = request.headers['authorization']
        if (!authHeader || !authHeader.startsWith('Bearer ')) throw new BadRequest('Missing token')

        // get the token from the authorization header
        const token = authHeader.split(' ')[1]
        if (!token) throw new BadRequest('Invalid token')

        // pass if the token is the admin token of the app
        if (token === process.env['API_ADMIN_TOKEN']) return
        
        // verify that the token is a valid FMA protected (or not) OAuth2 token -> https://stackoverflow.com/questions/71166596/is-there-a-way-to-check-if-a-discord-account-token-is-valid-or-not
        // FIXME: doesn't match actual tokens
        //if (!token.match(fmaTokenRegex) && !token.match(nonFmaTokenRegex)) return ctx.throw(400, 'Invalid token')

        // directly skip the middleware if the token is already in the store, which is used here as a "cache"
        const authorizedAPITokens = this.store.get('authorizedAPITokens')
        if (authorizedAPITokens.includes(token)) return
        
        // we get the user's profile from the token using the `discord-oauth2` package
        discordOauth2.getUser(token)
        .then(async (user) => {

            // check if logged user is a dev (= admin) of the bot
            if (isDev(user.id)) {

                // we add the token to the store and set a timeout to remove it after 10 minutes
                this.store.update('authorizedAPITokens', (authorizedAPITokens) => [...authorizedAPITokens, token])
                setTimeout(() => {
                    this.store.update('authorizedAPITokens', (authorizedAPITokens) => authorizedAPITokens.filter(t => t !== token))
                }, timeout)

            } else {
                throw new Unauthorized('Unauthorized')
            }
        })
        .catch(async (err) => {
            throw new BadRequest('Invalid token')
        })
    }
}