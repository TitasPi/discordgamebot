const Embeds = require('../utils/embeds');

exports.name = 'balance';
exports.description = 'Shows your balance';
exports.aliases = 'bal';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PetShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    const target = message.mentions.users.first() || message.author;
    return message.channel.send(Embeds.balance(target, Currency));
};