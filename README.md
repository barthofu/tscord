<p align="center">
    <img width="500" height="500" src="https://i.imgur.com/19Nas88.png">
</p>

# 🌟 What is TSCord

**TSCord** is a fully-featured *template* written in [Typescript](https://www.typescriptlang.org/) for *discord bots*, intended to provide a framework that's easy to use, extend and modify.

It uses [discord.ts](https://github.com/oceanroleplay/discord.ts) and [discord.js v13](https://github.com/discordjs/discord.js) under the hood to simplify the development of discord bots.

This template was created to give developers a starting point for new Discord bots, so that much of the initial setup can be avoided and developers can instead focus on meaningful bot features. Developers can simply copy this repo, follow the [setup instructions](https://barthofu.github.io/tscord-template-docs), and have a working bot with many boilerplate features already included!

# 📜 Features

Talking about features, here are some of the core features of this template:

- Advanced handlers for:
    - Interactions (slash, context menu, button, modal, select menu, etc)
    - Simple message commands
    - Discord events listeners
- Guards functions, acting like middlewares on handlers with some built-ins:
    - Rate limiter
    - Maintenance mode
    - Disabling command
    - Guild only command (no DMs)
    - NSFW only command
    - Message's content match using regex
- Multiple databases support out-of-the-box using an ORM
- Migrations system to keep a safe database
- Automatic static assets upload to [imgur](https://imgur.com/)
- Custom events handlers
- Error handler
- Fully-typed localization (i18n)
- Local store
- Advanced logger with log files and discord channels support
- Scheduler for cron jobs
- Built-in rich statistics system

Also, this template is developper friendly and follow strict design patterns to ease its maintenance:
- Written in Typescript
- Built around the Dependency Injection and Singleton patterns
- Uses battle-tested libraries under the hood (*discord.ts* and *discord.js*)
- Built-in debugging setup for VSCode
- Support for running with the [PM2](https://pm2.keymetrics.io/) process manger
- Support for running with [Docker](https://www.docker.com/)
- CI/CD integration with Github Actions

and many more!

<details>
<summary>

## Todo

</summary>

#### Quick todo-list
- [ ] complete function [getPrefixFromMessage()](src/utils/functions/prefix.ts) (fallback prefix for DMs and retrieve prefix from Guild database)
- [ ] JSDoc on config files properties
- [x] Move `configs` to `@config`

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
- [x] Issues templates ([exemple](https://github.com/oceanroleplay/discord.ts/issues/new/choose))
- [x] Code of conduct
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

</details>