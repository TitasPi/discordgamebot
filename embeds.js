const Discord = require('discord.js');

exports.pleaseWait = function(message, timeLeft, time, command) {
    new Discord.MessageEmbed()
        .setTitle('Please wait')
        .setDescription(`${message.author}, please wait ${timeLeft.toFixed(1)}${time} before reusing the \`${command}\` command.`);
};

exports.balance = function(target, currency) {
    new Discord.MessageEmbed()
        .setTitle(`:coin: ${target.tag} Balance :coin:`)
        .setDescription(`${target} has ${currency.getBalance(target.id)}:coin:`);
};