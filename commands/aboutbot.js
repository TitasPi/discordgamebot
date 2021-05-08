const Embeds = require('../utils/embeds');

exports.name = 'aboutbot';
exports.description = 'Shows info about bot';
exports.aliases = 'bot';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    return message.channel.send(Embeds.aboutBot(PREFIX, VERSION));
};