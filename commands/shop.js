const Discord = require('discord.js');
const { getItemName } = require('../utils');

module.exports = async function(message, CurrencyShop) {
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