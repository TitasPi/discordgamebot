const Discord = require('discord.js');

module.exports = async function(message, HouseShop) {
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

    return message.channel.send(new Discord.MessageEmbed().setTitle('Shop').setDescription(shopItems));
};