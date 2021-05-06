const Discord = require('discord.js');
const { Op } = require('sequelize');
const { getItemName } = require('../utils');

// eslint-disable-next-line no-unused-vars
module.exports = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
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
    if(item.name == 'Iron Pickaxe' || item.name == 'Iron Pickaxe' || item.category == 'Food' || item.category == 'Fishing') {
        item.stock += 1;
        item.save();
    }

    await user.sellItem(item);
    await Currency.add(message.author.id, item.sellPrice);

    message.channel.send(new Discord.MessageEmbed().setTitle('Shop').setDescription(`You've sold 1x **${getItemName(item)}** for ${item.sellPrice} :coin:`));
};