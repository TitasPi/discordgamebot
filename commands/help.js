const Embeds = require('../utils/embeds');

exports.name = 'help';
exports.description = 'Shows help';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    return message.channel.send(Embeds.help(PREFIX));
};