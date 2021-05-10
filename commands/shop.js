const Discord = require('discord.js');
const { getItemName } = require('../utils/utils');
const Logger = require('../utils/logger');
const Embeds = require('../utils/embeds');

exports.name = 'shop';
exports.description = 'Shows shop';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PetShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    try {
        const items = await CurrencyShop.findAll({
            order: [
                ['id', 'ASC'],
            ],
        });
        let shopItems = '';
        items.forEach(i => {
            if(i.buyable == 1) {
                if(i.durability > 0) {
                    shopItems += `**${getItemName(i)}**: ${i.buyPrice} :coin: (${i.stock} left) (Durability: ${i.durability} uses)\n`;
                }
                else {
                    shopItems += `**${getItemName(i)}**: ${i.buyPrice} :coin: (${i.stock} left)\n`;
                }
            }
        });

        return message.channel.send(new Discord.MessageEmbed().setTitle('🛒 Shop 🛒').setDescription(shopItems));
    }
    catch (error) {
        Logger.error(`Caught error while executing '${this.name}' command: ${error}`);
        message.channel.send(Embeds.error());
    }
};