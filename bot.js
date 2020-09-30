var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
    //logger.info(bot);
    bot.setPresence({ game: { name: '!rps help', type: 0 } });

});

var playCmds;
var validCmds;

bot.on('message', function (user, userID, channelID, message, evt) {
    
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {

            case 'rps':
                if (isPlay(args[0])) {
                    var botPlay = play();
                    bot.sendMessage({
                        to: channelID,
                        message: 'I play '+ botPlay + '! '+ calculateWinner(botPlay, args[0])
                    });
                } else if (isValid(args[0])) {

                    switch (args[0]) {

                        case 'help':

                        case 'cmds':
                            bot.sendMessage({
                                to: channelID,
                                message: 'Commands: ' + displayCmds(validCmds)
                            });
                        break;

                        case 'about':
                            bot.sendMessage({
                                to: channelID,
                                message: 'This bot plays Rock Paper Scissors. Created by Idris.'
                            });
                        break;

                        case 'link':
                            bot.sendMessage({
                                to: channelID,
                                message: 'You can use the link below to invite this bot to your server. https://discordapp.com/oauth2/authorize?&client_id=498551884781453313&scope=bot&permissions=8'
                            });
                        break;

                        default:
                            bot.sendMessage({
                                to: channelID,
                                message: 'Usage: !rps [rock/paper/scissors]'
                            });
                    }

                } else {
                    bot.sendMessage({
                        to: channelID,
                        message: 'Usage: !rps [rock/paper/scissors]'
                    });
                }

            break;
            
         }
     }
});

function play () {

    var chance = parseInt(Math.random()*3);

    if (chance == 0) {
        return "rock";
    } else if (chance == 1) {
        return "paper";
    } else {
        return "scissors";
    }

}

function calculateWinner (botPlay, realPlay) {

    if (botPlay === "rock" && realPlay === "scissors") {
        return ":punch::skin-tone-5: I win!";
    } else if (botPlay === "rock" && realPlay === "paper") {
        return ":punch::skin-tone-5: You beat me!";
    } else if (botPlay === "rock" && realPlay === "rock") {
        return ":punch::skin-tone-5: We draw!";
    } else if (botPlay === "paper" && realPlay === "rock") {
        return ":raised_hand::skin-tone-5: I win!";
    } else if (botPlay === "paper" && realPlay === "scissors") {
        return ":raised_hand::skin-tone-5: You beat me!";
    } else if (botPlay === "paper" && realPlay === "paper") {
        return ":raised_hand::skin-tone-5: We draw!";
    } else if (botPlay === "scissors" && realPlay === "paper") {
        return ":v::skin-tone-5: I win!";
    } else if (botPlay === "scissors" && realPlay === "rock") {
        return ":v::skin-tone-5: You beat me!";
    } else if (botPlay === "scissors" && realPlay === "scissors") {
        return ":v::skin-tone-5: We draw!";
    } else {
        return "But why?";
    }

}

function isPlay (play) {

    playCmds = ["rock", "paper", "scissors"];

    for (i = 0; i < playCmds.length; i++) {
        if (play === playCmds[i]) {
            return true;
        }
    }

    return false;

}

function isValid (play) {

    validCmds = ["help", "cmds", "about", "link", "rock/paper/scissors"];

    for (i = 0; i < validCmds.length; i++) {
        if (play === validCmds[i]) {
            return true;
        }
    }

    return false;

}

function displayCmds(dTable) {

    var res = "[";

    for (i = 0; i<dTable.length; i++) {
        if (i == 0) {
            res += dTable[i];
            continue;
        }
        res += ", " + dTable[i]
    }
    res += "]";
    return res;

}
