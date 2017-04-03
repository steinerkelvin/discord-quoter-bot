
lg = console.log.bind console

Discord = require 'discord.js'
moment = require 'moment'

{get_env, get_env_check} = require './util'

vars = {}
Object.assign(vars, get_env_check( ['LOCALE', 'DISCORD_BOT_TOKEN', 'DISCORD_USER_TOKEN'] ))
Object.assign(vars, get_env( ['PREFIX'] ))

moment.locale(vars.LOCALE)



CHANNEL_STRING = "in "
if vars.LOCALE in ['pt', 'pt-BR'] then CHANNEL_STRING = "em "

IMAGE_EXTENSIONS = ['jpeg', 'jpg', 'png', 'webp', 'gif']



isImage = (url) ->
  IMAGE_EXTENSIONS.some ( ext ) ->
    return url.endsWith('.'+ext)


class App
  constructor: (@vars) ->
    @prefix = @vars.PREFIX ? "$"
    @init_normal_bot()
    @init_user_bot()

  # inits dedicated bot
  init_normal_bot: () =>
    @bot_client = new (Discord.Client)
    @bot_client.on 'error', (err) ->
      console.error "#{ err?.stack or err }"
    @bot_client.on 'ready', =>
      console.log 'Normal bot ready'
    @bot_client.login @vars.DISCORD_BOT_TOKEN

  # inits user bot
  init_user_bot: () =>
    @client = new (Discord.Client)

    @client.on 'ready', =>
      console.log 'User bot ready'

    @client.on 'message', @handle_message
    @client.on 'messageUpdate', @handle_message

    @client.on 'error', (err) ->
      console.error "#{ err?.stack or err }"

    @client.login @vars.DISCORD_USER_TOKEN

  # sends message to user through the dedicated bot
  send_self_message: (txt) =>
    @bot_client.fetchUser(@client.user.id).then (user) ->
      return user.sendMessage(txt)

  # builds a string with channel and server(guild) names and timestamp
  build_message_footer: (message, showGuild=false) =>
    channel = message.channel
    footer = []
    if (name = channel?.name)
      footer.push CHANNEL_STRING+"\##{name}"
    if (showGuild and guild = channel?.guild)
      footer.push "\##{guild?.name}"
    footer.push moment( message.createdTimestamp ).calendar()+"\n"
    return footer.join(" — ")

  # handles all sent or updated messages
  handle_message: (message, old_message=null) =>
    # only proceeds if sender is the user himself
    if message.author == @client.user
      args = message.content.split(" ")
      cmd = args.shift()

      switch cmd
        when @prefix+'ping'
          message.reply 'pong'
        when @prefix+'q'
          @do_quote(message, args)
        when @prefix+'q@'
          @do_quote(message, args, cite=true)

  # resends or edits a message quoting the message with ID that equals the fisrt argument (in 'args')
  do_quote: (message, args=[], cite=false, edit=false) =>
    if not msg_id = args.shift()
      console.log "Missing parameter"
      # TODO add message for user
      return

    channel = message.channel

    # search messages with given ID and returns the first one
    channel.fetchMessages({ limit: 1, around: msg_id }).then (qt_msg) =>
        qt_msg = qt_msg.first()

        # if there is no message, send a error message to the user
        if not qt_msg
          console.warn "Message ID `#{msg_id}` not found"

          err_msg = "Message ID '#{msg_id}' not found. Original message:\n"
          err_msg += "`#{message.content}`\n"

          # stamp = []
          # if (name = channel?.name) then stamp.push CHANNEL_STRING+"\##{name}"  # TODO modularize this
          # if (guild = channel?.guild) then stamp.push "\##{guild?.name}"
          # stamp.push moment( message.createdTimestamp ).calendar()+"\n"
          # err_msg += stamp.join(" — ")
          err_msg += @build_message_footer(message, showGuild=true)

          @send_self_message(err_msg).then( ()-> message.delete() )
          return

        # joins the remaining arguments to make the message body
        res_text = args.join " "

        # checks if message is in a server (guild)
        if channel.guild
          member = channel.guild.member(qt_msg.author)
          author_name = member.nickname
          color = member.highestRole?.color  # adiciona cor de cargo

          # adds a citation to quoted message's user if it's enabled
          if  cite  and  res_text.search(member.toString()) == -1
            res_text = "#{member.toString()}" + if res_text then ", #{res_text}" else ""

        author_name ?= qt_msg.author.username

        timestamp = moment( qt_msg.createdTimestamp ).calendar()

        footer = []
        # adds channel name to footer if it exists
        if (name = channel.name) then footer.push CHANNEL_STRING+"\##{channel.name}"
        footer.push "#{timestamp}"

        opts =
          embed:
              author:
                name: author_name
                icon_url: qt_msg.author.avatarURL
              description: "#{qt_msg.content}"
              footer:
                text: footer.join " "
              color: color
              image: {url: null}
              fields: []

        (qt_msg.attachments.some (attachment, id) ->
          url = attachment.url
          if isImage(url)
            opts.embed.image.url = url
            return true
        ) or (
          qt_msg.embeds.some (embed, id) ->
            if (url = embed?.thumbnail?.url)
              opts.embed.image.url = url
              return true
        )

        if edit
          message.edit(res_text, opts).then (res_message)->
            lg "Message updated: #{res_message.content}"
        else
          channel.sendMessage(res_text, opts).then (res_message) ->
            lg "Sent message: #{res_message.content}"
            message.delete()


if !module.parent
  bot = new App(vars)
else
  module.exports = {App}
