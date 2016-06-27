var Botkit = require('botkit');

var controller = Botkit.slackbot({
    debug: false
        //include "log: false" to disable logging
        //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

// connect the bot to a stream of messages
controller.spawn({
    token: process.env.SLACK_BOT_TOKEN,
}).startRTM()

// give the bot something to listen for.
var timeRegex = '([0-9]{1,2})\s?(:([0-5]?[0-9]))?((([p][m])|([a][m]))|(([P][M])|([A][M])))';

controller.hears(timeRegex, ['ambient'], function(bot, message) {
    console.log("bot matched time - " + message.match[0]);

    // find the time zones of users in this channel 
    var channel = message.channel;
    bot.api.channels.info({
        channel
    }, function(err, channelResponse) {
        channelResponse.channel.members.forEach(function(memberId) {
            bot.api.users.info({
                user: memberId
            }, function(err, userResponse) {
                var username = userResponse.user.name;
                console.log(username);
                var date = new Date();
                console.log("timezone offset " + (date.getTimezoneOffset() / 60));
                console.log("tz offset " + userResponse.user.tz_offset);

                var offset = (date.getTimezoneOffset() / 60) + (userResponse.user.tz_offset / 3600);
                console.log("date hours " + date.getHours());

                console.log("offset " + offset);
                date.setHours(date.getHours() + offset);

                var msg = username + " " + String(date.getHours()) + ":" + String(date.getMinutes());
                bot.reply(message, msg);

            });
        });
    });
});