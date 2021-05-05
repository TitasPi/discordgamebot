const Discord = require('discord.js');

module.exports = async function(message, currency) {
    const target = message.mentions.users.first() || message.author;
    return message.channel.send(new Discord.MessageEmbed().setTitle(`:coin: ${target.tag} Balance :coin:`).setDescription(`${target} has ${currency.getBalance(target.id)}:coin:`));
};