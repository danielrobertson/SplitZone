var Botkit = require('botkit');

var controller = Botkit.slackbot({
    debug: false
});

// connect the bot to a stream of messages
controller.spawn({
    token: process.env.SLACK_BOT_TOKEN,
}).startRTM()

// listen for a time 
var timeRegex = '([0-9]{1,2})\s?(:([0-5]?[0-9]))?((([p][m])|([a][m]))|(([P][M])|([A][M])))';

controller.hears(timeRegex, ['ambient'], function(bot, message) {
    console.log("bot matched time - " + message.match[0]);

    // find the time zones of users in this channel 
    var channel = message.channel;
    bot.reply(message, "To clarify, that time translates too...");
    bot.api.channels.info({channel}, function(err, channelResponse) {
        channelResponse.channel.members.forEach(function(memberId) {
            bot.api.users.info({user: memberId}, function(err, userResponse) {
                var username = userResponse.user.name;
                console.log(username);
                
                var date = parseTime(message.match[0]); 
                var offset = (date.getTimezoneOffset() / 60) + (userResponse.user.tz_offset / 3600);
                date.setHours(date.getHours() + offset);

                var msg = String(date.getHours());
                if(date.getMinutes() !== 0) {
                    msg +=":" + String(date.getMinutes())
                }
                msg += " for " + username + "\n"; 
                
                bot.reply(message, msg);
            });
        });
    });
});

function parseTime(time) {
    var dt = new Date();

    var time = time.match(/(\d+)(?::(\d\d))?\s*(p?)/i);
    if (!time) {
        return NaN;
    }
    var hours = parseInt(time[1], 10);
    if (hours == 12 && !time[3]) {
        hours = 0;
    }
    else {
        hours += (hours < 12 && time[3]) ? 12 : 0;
    }

    dt.setHours(hours);
    dt.setMinutes(parseInt(time[2], 10) || 0);
    dt.setSeconds(0, 0);
    return dt;
}