const Discord = require('discord.js');
const Logger = require('../utils/logger');
const Embeds = require('../utils/embeds');

exports.name = 'petshop';
exports.description = 'Shows pet shop';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PetShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    try {
        const items = await PetShop.findAll();
        let shopItems = '';
        items.forEach(i => {
            if(i.buyable == 1) {
                shopItems += `${i.name}: (Buy: ${i.buyPrice} :coin: | Sell: ${i.sellPrice} :coin:) (${i.stock} left)\n`;
            }
            else {
                shopItems += `${i.name}\n`;
            }
        });

        return message.channel.send(new Discord.MessageEmbed().setTitle('🛒 Shop 🐕').setDescription(shopItems));
    }
    catch (error) {
        Logger.error(`Caught error while executing '${this.name}' command: ${error}`);
        message.channel.send(Embeds.error());
    }
};