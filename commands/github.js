const Embeds = require('../utils/embeds');

exports.name = 'github';
exports.description = 'Shows bot repository';
exports.aliases = 'gitlab';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PetShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    return message.channel.send(Embeds.gitHub());
};