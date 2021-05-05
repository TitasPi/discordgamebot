const Discord = require('discord.js');
const { Op } = require('sequelize');
const { getItemName } = require('../utils');

module.exports = async function(message, currency, commandArgs, CurrencyShop, Users) {
    let item = '';
    if(commandArgs === 'axe' || commandArgs === 'Axe') {
        item = await CurrencyShop.findOne({
            where: { name: { [Op.like]: 'Iron Axe' }, sellable: 1 },
            order: [ ['id', 'ASC'] ],
        });
    }
    else {
        item = await CurrencyShop.findOne({
            where: { name: { [Op.like]: `%${commandArgs}%` }, sellable: 1 },
            order: [ ['id', 'ASC'] ],
        });
    }
    if (!item) return message.channel.send(new Discord.MessageEmbed().setTitle('Shop').setDescription('That item doesn\'t exist.'));
    const user = await Users.findOne({ where: { user_id: message.author.id } });
    const userItem = await user.hasItem(item);
    if(!userItem) {
        return message.channel.send(new Discord.MessageEmbed().setTitle('Shop').setDescription('You do not have this item'));
    }

    const amount = await user.sellAllItems(item);
    if(item.name == 'Iron Pickaxe' || item.name == 'Iron Pickaxe' || item.category == 'Food') {
        item.stock += amount;
        item.save();
    }

    await currency.add(message.author.id, item.sellPrice * amount);

    message.channel.send(new Discord.MessageEmbed().setTitle('Shop').setDescription(`You've sold ${amount}x **${getItemName(item)}** for ${item.sellPrice * amount} :coin:`));
};