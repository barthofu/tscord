# Discord Bot Template (v13)

## Todo
- [x] Add the possibility to filter or not interactions logs at a granular level (button, selectmenu, etc) in the `config.json`
- [x] Timezone in config (e.g: Schedule)
- [x] Remove extended client (in favor of a full DI pattern)

## Features

#### Discord
- [ ] Custom events
    - [ ] `guildAdminRemove`
    - [x] `guildAdminAdd`
    - [x] `simpleCommandCreate`
- [x] Events
    - [x] `ready`
    - [x] `interactionCreate`
    - [x] `guildCreate`
    - [x] `guildDelete`
    - [x] `messageCreate`
- [x] Guards implementations
    - [x] user is bot
    - [x] nsfw
    - [x] cooldown
    - [x] maintenance
    - [x] dm
    - [x] enabled
    - [x] match
    - [x] permissions
- [X] Activities
- [x] Guards fallback message
- [x] [discord.js](https://github.com/discordjs/discord.js/) implementation
- [x] [discord.ts](https://github.com/oceanroleplay/discord.ts) implementation

#### Data
- [ ] Other databases
- [x] Users/Guilds sync with database
- [x] SQLite database
- [x] ORM (w/ [mikro-orm](https://github.com/mikro-orm/mikro-orm))
- [x] EAV pattern implementation for single data types
- [x] State store system (no database)
- [x] Built-in entities
    - [x] User
    - [x] Guild
    - [x] Stats

#### Utilities
- [ ] Errors handling
- [x] Stats
- [x] Localization
- [x] Logger
- [x] Cron tasks

#### Built-in commands
- [ ] General
    - [ ] `help`
    - [ ] `info`
    - [ ] `invite`
    - [x] `stats`
    - [x] `ping` (with latency)
    
- [x] Admin
    - [x] `prefix`
- [x] Owner
    - [x] `eval`
    - [x] `maintenance`

#### DevOps
- [ ] .env.example
- [ ] Docker
- [ ] PM2
- [ ] Unit tests (jest)
- [ ] CI/CD
- [x] Debugging config for VSCode

#### Other
- [ ] JDoc
- [ ] Comment code
- [ ] ESlint / Prettier
- [ ] Readme ([exemple](https://github.com/cristianireyes/ds-bot-core)) + Doc / wiki 
- [ ] Issues templates ([exemple](https://github.com/oceanroleplay/discord.ts/issues/new/choose))
- [ ] Code of conduct

#### Bonus
- [ ] Online dashboard for stats viuzalisation, monitoring, etc (using [Next.js](https://nextjs.org/) and [@discordx/koa](https://www.npmjs.com/package/@discordx/koa))
- [ ] Convert the template as an `npx` auto generated boilerplate (using [plop](https://github.com/plopjs/plop))
- [ ] Multiple database server instances connections
- [ ] Clustering + Sharding ([example](https://github.com/KevinNovak/Discord-Bot-TypeScript-Template#commands))
- [ ] Integrations with bot lists (e.g: top.gg)
- [ ] Pimp console logs ([chalk](https://github.com/chalk/chalk))
- [x] CLI to generates (also using *plop*) :
    - [x] Entities (maybe a simple wrapper of *mikro-orm* CLI)
    - [x] Commands
    - [x] Guards
    - [x] Events