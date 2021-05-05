const Discord = require('discord.js');

module.exports = async function(message, currency, commandArgs) {
    const currentAmount = currency.getBalance(message.author.id);
    const transferAmount = commandArgs.split(/ +/).find(arg => !/<@!?\d+>/.test(arg));
    const transferTarget = message.mentions.users.first();

    if (!transferAmount || isNaN(transferAmount)) return message.channel.send(new Discord.MessageEmbed().setTitle('Transfer').setDescription(`Sorry ${message.author}, that's an invalid amount`));
    if (transferAmount > currentAmount) return message.channel.send(new Discord.MessageEmbed().setTitle('Transfer').setDescription(`Sorry ${message.author} you don't have that much.`));
    if (transferAmount <= 0) return message.channel.send(new Discord.MessageEmbed().setTitle('Transfer').setDescription(`Please enter an amount greater than zero, ${message.author}`));
    if (transferTarget == undefined) return message.channel.send(new Discord.MessageEmbed().setTitle('Transfer').setDescription(`Sorry ${message.author}, I can't find the user you mentioned`));

    currency.add(message.author.id, -transferAmount);
    currency.add(transferTarget.id, transferAmount);

    return message.channel.send(new Discord.MessageEmbed().setTitle('Transfer').setDescription(`Successfully transferred ${transferAmount}:coin: to ${transferTarget}. Your current balance is ${currency.getBalance(message.author.id)}:coin:`));

};