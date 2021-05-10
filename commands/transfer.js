const Discord = require('discord.js');
const Logger = require('../utils/logger');
const Embeds = require('../utils/embeds');

exports.name = 'transfer';
exports.description = 'Transfer money to other people';
exports.aliases = 'pay';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PetShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    try {
        const currentAmount = Currency.getBalance(message.author.id);
        const transferAmount = commandArgs.split(/ +/).find(arg => !/<@!?\d+>/.test(arg));
        const transferTarget = message.mentions.users.first();

        if (!transferAmount || isNaN(transferAmount)) return message.channel.send(new Discord.MessageEmbed().setTitle('Transfer').setDescription(`Sorry ${message.author}, that's an invalid amount`));
        if (transferAmount > currentAmount) return message.channel.send(new Discord.MessageEmbed().setTitle('Transfer').setDescription(`Sorry ${message.author} you don't have that much.`));
        if (transferAmount <= 0) return message.channel.send(new Discord.MessageEmbed().setTitle('Transfer').setDescription(`Please enter an amount greater than zero, ${message.author}`));
        if (transferTarget == undefined) return message.channel.send(new Discord.MessageEmbed().setTitle('Transfer').setDescription(`Sorry ${message.author}, I can't find the user you mentioned`));

        Currency.add(message.author.id, -transferAmount);
        Currency.add(transferTarget.id, transferAmount);

        return message.channel.send(new Discord.MessageEmbed().setTitle('Transfer').setDescription(`Successfully transferred ${transferAmount}:coin: to ${transferTarget}. Your current balance is ${Currency.getBalance(message.author.id)}:coin:`));
    }
    catch (error) {
        Logger.error(`Caught error while executing '${this.name}' command: ${error}`);
        message.channel.send(Embeds.error());
    }

};