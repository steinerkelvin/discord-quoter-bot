# node-discord-quoter-bot

Selfbot for quoting other Discord users using commands.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Command: `$q <message ID> [reply content]`

Config variables
* `DISCORD_BOT_TOKEN`:  Dedicated bot token
* `DISCORD_USER_TOKEN`:  User account token
* `PREFIX`:  Command prefix (default: `$`)
* `LOCALE`:  (default: `en`)
* `DATE_FORMAT`:  Date format (default: `calendar`)
  - e.g. `DD/MM/YYYY HH:mm Z` results in `07/05/2017 08:52 -03:00`
  - [documentation](https://momentjs.com/docs/#/displaying/format/)
* `TIMEZONE`: Timezone used to format time. (default: `UTC`)
  - [Available codes](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
* `EMPTY_MESSAGE`: String that replaces message body when no text passed to command. (default: empty)
* `SHOW_USER_DISCRIMINATOR`: Enables showing quoted user's discriminator number next to nickname (default: `true`)


---

### Bot Citador para Discord

Cite outros usuários do Discord usando comandos.

[Instruções em Português](https://github.com/kelvinss/node-discord-quoter-bot/blob/master/README.pt.md)
