# Discord Bot Template (v13)

## Todo

#### Discord
- [x] [discord.js](https://github.com/discordjs/discord.js/) implementation
- [x] [discord.ts](https://github.com/oceanroleplay/discord.ts) implementation
- [ ] Events
    - [x] `ready`
    - [x] `interactionCreate`
    - [ ] ...
- [ ] Guards implementations
    - [x] user is bot
    - [x] nsfw
    - [x] cooldown
    - [x] maintenance
    - [ ] dm
    - [ ] permissions
    - [ ] enabled
    - [ ] owner/dev
- [ ] Guards fallback message

#### Data
- [x] SQLite database
- [x] ORM (w/ [mikro-orm](https://github.com/mikro-orm/mikro-orm))
- [x] EAV pattern implementation for single data types
- [x] State store system (no database)
- [ ] Users/Guilds sync with database
- [ ] Built-in entities
    - [x] User
    - [x] Guild
    - [ ] Stats

#### Utilities
- [ ] Localization
- [ ] Stats
- [ ] Logger
- [ ] Cron tasks

#### Built-in commands
- [ ] General
    - [ ] `help`
    - [ ] `stats`
- [ ] Owner
    - [ ] `eval`
    - [ ] `maintenance`

#### Bonus
- [ ] Online dashboard for stats viuzalisation, monitoring, etc (using [Next.js](https://nextjs.org/) and [@discordx/koa](https://www.npmjs.com/package/@discordx/koa))
- [ ] Convert the template as an `npx` auto generated boilerplate (using [plop](https://github.com/plopjs/plop))
- [ ] CLI to generates (also using *plop*) :
    - [ ] Entities (maybe a simple wrapper of *mikro-orm* CLI)
    - [ ] Commands
    - [ ] Guards
    - [ ] Events