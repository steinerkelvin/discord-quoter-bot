// Generated by CoffeeScript 1.12.5
(function() {
  var App, CHANNEL_STRING, DISCRIMINATOR_STRING, Discord, IMAGE_EXTENSIONS, SERVER_STRING, bot, get_env, get_env_check, idt, isImage, isTrue, lg, lgErr, moment, ref, ref1, ref2, strNumberToSubscript, vars,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  lg = console.log.bind(console);

  lgErr = function(err) {
    return console.error("" + ((err != null ? err.stack : void 0) || err));
  };

  Discord = require('discord.js');

  moment = require('moment-timezone');

  ref = require('./util'), idt = ref.idt, get_env = ref.get_env, get_env_check = ref.get_env_check, isTrue = ref.isTrue, strNumberToSubscript = ref.strNumberToSubscript;

  vars = {};

  Object.assign(vars, get_env_check(['LOCALE', 'DISCORD_BOT_TOKEN', 'DISCORD_USER_TOKEN']));

  Object.assign(vars, get_env(['PREFIX', 'DATE_FORMAT', 'TIMEZONE', 'SHOW_USER_DISCRIMINATOR', 'EMPTY_MESSAGE']));

  moment.locale(vars.LOCALE);

  DISCRIMINATOR_STRING = " #";

  CHANNEL_STRING = "in ";

  if ((ref1 = vars.LOCALE) === 'pt' || ref1 === 'pt-BR') {
    CHANNEL_STRING = "em ";
  }

  SERVER_STRING = "at ";

  if ((ref2 = vars.LOCALE) === 'pt' || ref2 === 'pt-BR') {
    SERVER_STRING = "@ ";
  }

  IMAGE_EXTENSIONS = ['jpeg', 'jpg', 'png', 'webp', 'gif'];

  isImage = function(url) {
    return IMAGE_EXTENSIONS.some(function(ext) {
      return url.endsWith('.' + ext);
    });
  };

  App = (function() {
    function App(vars1) {
      var ref3;
      this.vars = vars1;
      this.do_quote = bind(this.do_quote, this);
      this.handle_message = bind(this.handle_message, this);
      this.build_message_footer = bind(this.build_message_footer, this);
      this.buildDateString = bind(this.buildDateString, this);
      this.send_self_message = bind(this.send_self_message, this);
      this.init_user_bot = bind(this.init_user_bot, this);
      this.init_normal_bot = bind(this.init_normal_bot, this);
      this.prefix = (ref3 = this.vars.PREFIX) != null ? ref3 : "$";
      this.DATE_FORMAT = vars.DATE_FORMAT || "calendar";
      this.TIMEZONE = vars.TIMEZONE || "UTC";
      this.EMPTY_MESSAGE = vars.EMPTY_MESSAGE || "";
      this.SHOW_USER_DISCRIMINATOR = isTrue(vars.SHOW_USER_DISCRIMINATOR);
      this.init_normal_bot();
      this.init_user_bot();
    }

    App.prototype.init_normal_bot = function() {
      this.bot_client = new Discord.Client;
      this.bot_client.on('error', function(err) {
        return console.error("" + ((err != null ? err.stack : void 0) || err));
      });
      this.bot_client.on('ready', (function(_this) {
        return function() {
          return console.log('Normal bot ready');
        };
      })(this));
      return this.bot_client.login(this.vars.DISCORD_BOT_TOKEN);
    };

    App.prototype.init_user_bot = function() {
      this.client = new Discord.Client;
      this.client.on('ready', (function(_this) {
        return function() {
          return console.log('User bot ready');
        };
      })(this));
      this.client.on('message', this.handle_message);
      this.client.on('messageUpdate', ((function(_this) {
        return function(o, n) {
          return _this.handle_message(n);
        };
      })(this)));
      this.client.on('error', function(err) {
        return console.error("" + ((err != null ? err.stack : void 0) || err));
      });
      return this.client.login(this.vars.DISCORD_USER_TOKEN);
    };

    App.prototype.send_self_message = function(txt) {
      return this.bot_client.fetchUser(this.client.user.id).then(function(user) {
        return user.sendMessage(txt);
      }, function(reason) {
        return lgErr(reason);
      });
    };

    App.prototype.buildDateString = function(timestamp) {
      if (this.DATE_FORMAT === "calendar") {
        return moment(timestamp).calendar();
      }
      return moment(timestamp).tz(this.TIMEZONE).format(this.DATE_FORMAT);
    };

    App.prototype.build_message_footer = function(message, showGuild) {
      var channel, footer, guild, name;
      if (showGuild == null) {
        showGuild = false;
      }
      channel = message.channel;
      footer = [];
      if ((name = channel != null ? channel.name : void 0)) {
        footer.push(CHANNEL_STRING + ("\#" + name));
      }
      if (showGuild && (guild = channel != null ? channel.guild : void 0)) {
        footer.push("" + SERVER_STRING + (guild != null ? guild.name : void 0));
      }
      footer = [footer.join(" ")].filter(idt);
      footer.push(this.buildDateString(message.createdTimestamp));
      return footer.join(" — ");
    };

    App.prototype.handle_message = function(message, old_message) {
      var args, cite, cmd;
      if (old_message == null) {
        old_message = null;
      }
      if (message.author.id === this.client.user.id) {
        args = message.content.split(" ");
        cmd = args.shift();
        switch (cmd) {
          case this.prefix + 'ping':
            return message.reply('pong');
          case this.prefix + 'q':
            return this.do_quote(message, args);
          case this.prefix + 'q@':
            return this.do_quote(message, args, cite = true);
        }
      }
    };

    App.prototype.do_quote = function(message, args, cite, edit) {
      var channel, msg_id;
      if (args == null) {
        args = [];
      }
      if (cite == null) {
        cite = false;
      }
      if (edit == null) {
        edit = true;
      }
      if (!(msg_id = args.shift())) {
        console.log("Missing parameter");
        return;
      }
      channel = message.channel;
      return channel.fetchMessages({
        limit: 1,
        around: msg_id
      }).then((function(_this) {
        return function(qt_msg) {
          var author_name, color, discriminator, err_msg, member, opts, ref3, res_text, showGuild;
          qt_msg = qt_msg.first();
          if (!qt_msg) {
            console.warn("Message ID `" + msg_id + "` not found");
            err_msg = "Message ID '" + msg_id + "' not found. Original message:\n";
            err_msg += "`" + message.content + "`\n";
            err_msg += _this.build_message_footer(message, showGuild = true);
            _this.send_self_message(err_msg).then((function() {
              return message["delete"]();
            }), function(reason) {
              return lgErr(reason);
            });
            return;
          }
          res_text = args.join(" ");
          if (channel.guild) {
            member = channel.guild.member(qt_msg.author);
            author_name = member.nickname;
            color = (ref3 = member.highestRole) != null ? ref3.color : void 0;
            if (cite && res_text.search(member.toString()) === -1) {
              res_text = ("" + (member.toString())) + (res_text ? ", " + res_text : "");
            }
          }
          if (author_name == null) {
            author_name = qt_msg.author.username;
          }
          if (_this.SHOW_USER_DISCRIMINATOR && (discriminator = qt_msg.author.discriminator)) {
            author_name += DISCRIMINATOR_STRING + strNumberToSubscript(discriminator);
          }
          opts = {
            embed: {
              author: {
                name: author_name,
                icon_url: qt_msg.author.avatarURL
              },
              description: "" + qt_msg.content,
              footer: {
                text: _this.build_message_footer(message)
              },
              color: color,
              image: {
                url: null
              },
              fields: []
            }
          };
          (qt_msg.attachments.some(function(attachment, id) {
            var url;
            url = attachment.url;
            if (isImage(url)) {
              opts.embed.image.url = url;
              return true;
            }
          })) || (qt_msg.embeds.some(function(embed, id) {
            var ref4, url;
            if ((url = embed != null ? (ref4 = embed.thumbnail) != null ? ref4.url : void 0 : void 0)) {
              opts.embed.image.url = url;
              return true;
            }
          }));
          res_text || (res_text = _this.EMPTY_MESSAGE);
          if (edit) {
            return message.edit(res_text, opts).then(function(res_message) {
              return lg("Message updated: " + res_message.content);
            }, function(reason) {
              return lgErr(reason);
            });
          } else {
            return channel.sendMessage(res_text, opts).then(function(res_message) {
              lg("Sent message: " + res_message.content);
              return message["delete"]();
            }, function(reason) {
              return lgErr(reason);
            });
          }
        };
      })(this), function(reason) {
        return lgErr(reason);
      });
    };

    return App;

  })();

  if (!module.parent) {
    bot = new App(vars);
  } else {
    module.exports = {
      App: App
    };
  }

}).call(this);

//# sourceMappingURL=bot.js.map
