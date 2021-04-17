<h1 align="center" font-weight="bold">Discord Bot Boilerplate/Template (v12)</h1>

<p align="center">
    <a href="http://forthebadge.com/" target="_blank">
    	<img src="http://forthebadge.com/images/badges/built-with-love.svg"
    </a>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT" target="_blank">
    <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License">
  </a>
</p>

> ### Here is my own discord.js bot boilerplate/template for those who wants to save some time! As easy as possible and ready to use, this modest template will satisfy all your needs.

#### Table of content:

* **[Installation](#installation)**
* **[Configuration](#configuration)**
* **[Usage](#usage)**
* **[Todo](#todo)**
* **[License](#license)**

## Installation

You can either clone this repo or fork it (to get the latest updates).

## Configuration

1. Put the token of your bot in the `.credentials.json` 

2. Open the `config.json` and edit it as you want:

```json
{
    "prefix": "!", //the prefix of your bot. Guilds with the property "prefix": null in the guilds.json will automatically 
    "description": "",  
    "language": "en", //select the overall language of the bot
    "ownerID": "YOUR_ID_HERE", //put your id therehere
    "dev": [
        "YOUR_ID_ALSO_HERE" //and also there
    ],
    "colors": {
        "default": "" //default embeds color
    },
    "evalName": "bot", //name to trigger the eval command 
    "startingConsoleDetailed": false,
    "backup": {
        "activated": false, 
        "channel": "", //channel to send the zip archive of the project
        "ignoredPaths": [
            "node_modules",
            "package-lock.json",
            ".git"
        ] //subfolders and subfiles to ignore in the archive 
    },
    "activities": [ //define the bot activities (phrases under its name). Types can be: PLAYING, LISTENING, WATCHING, STREAMING
        {
            "text": "discord.js v12",
            "type": "PLAYING"
        },
        {
            "text": "some knowledge",
            "type": "STREAMING"
        }
    ],
    "channels": {
        "logs": { //put channel ids here to 
            "commands": null, 
            "guildCreate": null,
            "guildDelete": null
        }
    }
}
```

3. To change the user or guild db object, go in -> `./src/models/User.js` or `./src/models/Guild.js`

## Usage

### Commands

Each command should be located in a distinct .js file inside the `./src/commands/{Name of the category}/` folder. You must split your commands in subfolders named as your wishes.

To create a command, duplicate the content of the `./src/commands/_template.js`.

Explanation of the commandParams constant, wich is basicaly the configuration of your command :

```js
const commandParams = {
    
    name: "", //the command itself. If this property doesn't exist, is nullish or equal to an empty string, the command name will automaticaly be the filename.
    aliases: [], //all the aliases of the command.
    desc: { //description of the command which will automaticaly be shown in the help command.
        en: "", 
        fr: ""
    },
    enabled: true, //make the command usable or not for the users and the devs.
    dm: false, //choose either the command can be used in DMs or not.
    nsfw: false, //choose either the command is NSFW (and then cannot be use outside an NSFW channel) or not.
    memberPermission: [], //define the permissions needed by the user to execute the command (e.g: ['ADMINISTRATOR'])
    botPermission: [], //define the permissions needed by the bot to execute the command
    owner: false, //make the command usable or not for the users.
    cooldown: null //define the cooldown of the command in milliseconds.

}
```

The command itself is a class which in instantiated only once at the startup of the bot. 
`async run()` is the method that is called when a user run the command.

In addition, this template has the ability to use subcommands. Just put the file in a tree of subfolders to create your subcommands environment.

e.g: 
```
src 
└──commands
   └── General
       └── manage    
           ├── create
           │   ├── house.js
           │   └── building.js
           └── info.js
```
will create the following commands (with `!` as prefix):
```
!manage create house
!manage create building
!managge info
```

### Database

This little template uses a tiny JSON local database manager known as *lowdb*.

You can find the documentation **[here](https://github.com/typicode/lowdb)**

Any json file inside of the `./src/db/` folder is synced in the `db` object. 
e.g: a json file named `example.json` will be accessible as a lowdb instance in `db.example`

## Todo

* ajouter dans les params des commandes un paramètre "mentionOnly" qui ne valide la commande qui si il y a une mention dedans

* au démarrage ça check les serveurs afin de se synchroniser avec la db (peut être déjà codé tho) + ça check si le prefix a été modifié et ça le change pour tous les serveurs concernés (peut faire un "prefix": null par défaut pour les serveurs qui prend le prefix dans la config)

* rename les variables et les db (genre mettre des "s" à la fin quand y'en a plusieurs, etc) et supprimer celles qui sont useless (re-réfléchir l'utilité du enabled alors que le owner existe déjà, etc)

## License
MIT License

Copyright (c) barthofu