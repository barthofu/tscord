<p align="center">
    <img width="500" height="500" src="https://i.imgur.com/19Nas88.png">
</p>

> Currently under heavy development <3

## Todo
- [ ] complete function [getPrefixFromMessage()](src/utils/functions/prefix.ts) (fallback prefix for DMs and retrieve prefix from Guild database)
- [ ] JSDoc on config files properties

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
- [ ] Other databases support
- [ ] Automatic backup
- [x] Automatic assets upload and association
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
    - [ ] log to discord channel
- [x] Cron tasks

#### Built-in commands
- [ ] General
    - [ ] `info`
    - [ ] `invite`
    - [x] `help`
    - [x] `stats`
    - [x] `ping` (with latency)
    
- [x] Admin
    - [x] `prefix`
- [x] Owner
    - [x] `eval`
    - [x] `maintenance`

#### DevOps
- [ ] CI/CD
- [ ] .devcontainer (Codespaces config)
- [x] PM2
- [x] Docker
- [x] .env.example
- [x] Debugging config for VSCode
- ~~Unit tests (not relevant atm)~~

#### Other
- [ ] Documentation using [docusaurus](https://docusaurus.io)
- [ ] Comment code
- [ ] ESlint / Prettier
- [ ] Readme ([exemple](https://github.com/cristianireyes/ds-bot-core)) 
- [ ] Issues templates ([exemple](https://github.com/oceanroleplay/discord.ts/issues/new/choose))
- [ ] Code of conduct
- [x] JSDoc

#### Bonus
- [ ] Online dashboard for stats viuzalisation, monitoring, etc (using [Next.js](https://nextjs.org/) and [@discordx/koa](https://www.npmjs.com/package/@discordx/koa))
- [ ] Extensions
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