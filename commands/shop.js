const Discord = require('discord.js');
const { getItemName } = require('../utils/utils');

exports.name = 'shop';
exports.description = 'Shows shop';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
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
};