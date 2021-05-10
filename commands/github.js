const Embeds = require('../utils/embeds');
const Logger = require('../utils/logger');

exports.name = 'github';
exports.description = 'Shows bot repository';
exports.aliases = 'gitlab';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PetShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    try {
        return message.channel.send(Embeds.gitHub());
    }
    catch (error) {
        Logger.error(`Caught error while executing '${this.name}' command: ${error}`);
        message.channel.send(Embeds.error());
    }
};