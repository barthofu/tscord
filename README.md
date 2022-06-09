# Discord Bot Template (v13)

## Todo
- [x] Remove extended client (in favor of a full DI pattern)
- [ ] Timezone in config (e.g: Schedule)

## Features

#### Discord
- [x] [discord.js](https://github.com/discordjs/discord.js/) implementation
- [x] [discord.ts](https://github.com/oceanroleplay/discord.ts) implementation
- [ ] Events
    - [x] `ready`
    - [x] `interactionCreate`
    - [ ] ...
- [ ] Custom events
    - [x] `guildAdminAdd`
    - [ ] `guildAdminRemove`
    - [ ] `trigger` (event triggered when a regex/word/sentence is met in a message)
- [ ] Guards implementations
    - [x] user is bot
    - [x] nsfw
    - [x] cooldown
    - [x] maintenance
    - [x] dm
    - [x] enabled
    - [ ] permissions
- [x] Guards fallback message
- [ ] Activities

#### Data
- [x] SQLite database
- [ ] Other databases
- [x] ORM (w/ [mikro-orm](https://github.com/mikro-orm/mikro-orm))
- [x] EAV pattern implementation for single data types
- [x] State store system (no database)
- [ ] Users/Guilds sync with database
- [x] Built-in entities
    - [x] User
    - [x] Guild
    - [x] Stats

#### Utilities
- [x] Localization
- [ ] Stats
- [x] Logger
- [x] Cron tasks
- [ ] Errors handling

#### Built-in commands
- [ ] General
    - [ ] `ping` (with latency)
    - [ ] `help`
    - [ ] `stats`
    - [ ] `info`
    - [ ] `invite`
    
- [ ] Admin
    - [ ] `prefix`
- [ ] Owner
    - [ ] `eval`
    - [ ] `maintenance`

#### DevOps
- [ ] Debugging config for VSCode
- [ ] Docker
- [ ] PM2
- [ ] Unit tests (jest)
- [ ] CI/CD

#### Other
- [ ] JDoc
- [ ] Comment code
- [ ] ESlint / Prettier
- [ ] Readme ([exemple](https://github.com/cristianireyes/ds-bot-core)) + Doc / wiki 

#### Bonus
- [ ] Online dashboard for stats viuzalisation, monitoring, etc (using [Next.js](https://nextjs.org/) and [@discordx/koa](https://www.npmjs.com/package/@discordx/koa))
- [ ] Convert the template as an `npx` auto generated boilerplate (using [plop](https://github.com/plopjs/plop))
- [ ] CLI to generates (also using *plop*) :
    - [ ] Entities (maybe a simple wrapper of *mikro-orm* CLI)
    - [ ] Commands
    - [ ] Guards
    - [ ] Events
- [ ] Multiple database server instances connections
- [ ] Clustering + Sharding ([example](https://github.com/KevinNovak/Discord-Bot-TypeScript-Template#commands))
- [ ] Integrations with bot lists (e.g: top.gg)
- [ ] Pimp console logs ([chalk](https://github.com/chalk/chalk))