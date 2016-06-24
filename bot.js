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
    bot.reply(message, 'Did someone say ' + message.match[0] + '?');

});