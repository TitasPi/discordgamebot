const Embeds = require('../embeds');

exports.name = 'balance';
exports.description = 'Shows your balance';
exports.aliases = 'bal';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    const target = message.mentions.users.first() || message.author;
    return message.channel.send(Embeds.balance(target, Currency));
};