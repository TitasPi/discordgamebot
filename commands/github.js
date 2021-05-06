const Embeds = require('../embeds');

// eslint-disable-next-line no-unused-vars
module.exports = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    return message.channel.send(Embeds.gitHub());
};