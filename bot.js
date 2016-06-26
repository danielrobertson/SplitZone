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
	var date = new Date(); 

    // find the time zones of users in this channel 
    var channel = message.channel;
    bot.api.channels.info({channel}, function(err, channelResponse) {
        channelResponse.channel.members.forEach(function(memberId) {
            bot.api.users.info({
                user:memberId
            }, function(err, userResponse) {
				var username = userResponse.user.name; 
        		var tzOffsetHours = userResponse.user.tz_offset / 3600;
        		var botTzOffsetHours = date.getTimezoneOffset() / 60; 
        		var totalOffsetHours = botTzOffsetHours + tzOffsetHours; 
        		date.setHours(totalOffsetHours); 

        		var msg = username + " " + String(date.getHours())+ ":" + String(date.getMinutes()); 
        		bot.reply(message, msg); 
            		
            });
        });
    });
});
