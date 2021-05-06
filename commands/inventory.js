const Discord = require('discord.js');
const { getItemName } = require('../utils');

module.exports = async function(Users, message) {
    const target = message.mentions.users.first() || message.author;
    const user = await Users.findOne({ where: { user_id: target.id } });
    const items = await user.getItems();

    if (!items.length) return message.channel.send(new Discord.MessageEmbed().setTitle(`${target.tag}'s inventory`).setDescription(`${target.tag} has nothing!`));

    const userInventory = new Discord.MessageEmbed().setTitle(`${target.tag}'s inventory`);

    items.forEach(item => {
        userInventory.addField(`${item.amount}x ${getItemName(item.item)}`, `(Buy: ${item.item.buyPrice}:coin: | Sell: ${item.item.sellPrice}:coin:)`, true);
    });

    return message.channel.send(userInventory);
};