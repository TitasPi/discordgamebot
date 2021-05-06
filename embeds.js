const Discord = require('discord.js');

exports.pleaseWait = function(message, timeLeft, time, command) {
    return(new Discord.MessageEmbed()
        .setTitle('Please wait')
        .setDescription(`${message.author}, please wait ${timeLeft.toFixed(1)}${time} before reusing the \`${command}\` command.`));
};

exports.balance = function(target, currency) {
    return(new Discord.MessageEmbed()
        .setTitle(`:coin: ${target.tag} Balance :coin:`)
        .setDescription(`${target} has ${currency.getBalance(target.id)}:coin:`));
};

exports.leaderboard = function(list) {
    return(new Discord.MessageEmbed()
        .setTitle(':coin: **Leaderboard** :coin:')
        .setDescription(list));
};

exports.error = function() {
    return(new Discord.MessageEmbed()
        .setTitle(':warning: **Error occured** :warning:')
        .setDescription('Error has occured while executing command.\nContact staff if this occurs more often.'));
};

exports.aboutBot = function(prefix, version) {
    return(new Discord.MessageEmbed()
        .setTitle(':robot: DGB :robot:')
        .setDescription('Quite unique game bot on Discord')
        .addField('Author', 'Titas#5726', true)
        .addField('Version', version, true));
};

exports.gitlab = function() {
    return(new Discord.MessageEmbed()
        .setTitle(':robot: DGB Repository :robot:')
        .setDescription('This bot has repository on [GitLab](https://gitlab.com/TitasNxLT/discordgamebot)'));
};

exports.help = function(prefix) {

    const helpObj = [
        { 'command': 'help', 'description': 'help command' },
        { 'command': 'about', 'description': 'gives info about you/user' },
        { 'command': 'mine', 'description': 'mine ores' },
        { 'command': 'chop', 'description': 'chop wood' },
        { 'command': 'fish', 'description': 'fish fishes' },
        { 'command': 'cook', 'description': 'cook food' },
        { 'command': 'smelt', 'description': 'smelt ores' },
        { 'command': 'loot', 'description': 'loot items' },
        { 'command': 'shop', 'description': 'see shop' },
        { 'command': 'houseshop', 'description': 'see house shop' },
        { 'command': 'buy', 'description': 'buy items' },
        { 'command': 'buyhouse', 'description': 'buy house' },
        { 'command': 'sell', 'description': 'sell items' },
        { 'command': 'sellall', 'description': 'sell all type items' },
        { 'command': 'attack', 'description': 'attack enemies' },
        { 'command': 'eat', 'description': 'eat food' },
        { 'command': 'mining', 'description': 'see mining stats' },
        { 'command': 'woodcutting', 'description': 'see woodcutting stats' },
        { 'command': 'smithing', 'description': 'see smithing stats' },
        { 'command': 'smithing', 'description': 'see smithing stats' },
    ];

    return(new Discord.MessageEmbed()
        .setTitle(':question: **Help** :question:')
        .setDescription(helpObj.map((cmd) => `**${prefix}${cmd['command']}** - ${cmd['description']}`)));
};