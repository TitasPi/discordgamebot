const Discord = require('discord.js');

// eslint-disable-next-line no-unused-vars
module.exports = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    const items = await HouseShop.findAll();
    let shopItems = '';
    items.forEach(i => {
        if(i.buyable == 1) {
            shopItems += `${i.name}: (Buy: ${i.buyPrice} :coin: | Sell: ${i.sellPrice} :coin:) (${i.stock} left)\n`;
        }
        else {
            shopItems += `${i.name}\n`;
        }
    });

    return message.channel.send(new Discord.MessageEmbed().setTitle('🛒 Shop 🏬').setDescription(shopItems));
};