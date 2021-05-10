const Embeds = require('../utils/embeds');
const Logger = require('../utils/logger');

exports.name = 'balance';
exports.description = 'Shows your balance';
exports.aliases = 'bal';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PetShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    try {
        const target = message.mentions.users.first() || message.author;
        return message.channel.send(Embeds.balance(target, Currency));
    }
    catch (error) {
        Logger.error(`Caught error while executing '${this.name}' command: ${error}`);
        message.channel.send(Embeds.error());
    }
};