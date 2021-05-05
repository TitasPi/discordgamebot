const Discord = require('discord.js');
const { Op } = require('sequelize');
const { getItemName } = require('../utils');

module.exports = async function(message, currency, commandArgs, CurrencyShop, Users) {
    let item = '';
    if(commandArgs === 'axe' || commandArgs === 'Axe') {
        item = await CurrencyShop.findOne({
            where: { name: { [Op.like]: 'Iron Axe' }, buyable: 1 },
            order: [ ['id', 'ASC'] ],
        });
    }
    else {
        item = await CurrencyShop.findOne({
            where: { name: { [Op.like]: `%${commandArgs}%` }, buyable: 1 },
            order: [ ['id', 'ASC'] ],
        });
    }
    if (!item) return message.channel.send(new Discord.MessageEmbed().setTitle('Shop').setDescription('That item doesn\'t exist.'));
    if (item.buyPrice > currency.getBalance(message.author.id)) {
        return message.channel.send(new Discord.MessageEmbed().setTitle('Shop').setDescription(`You don't have enough currency, ${message.author}`));
    }
    if (item.stock == 0) {
        return message.channel.send(new Discord.MessageEmbed().setTitle('Shop').setDescription(`${getItemName(item)} is out of stock`));
    }
    item.stock -= 1;
    item.save();

    const user = await Users.findOne({ where: { user_id: message.author.id } });
    currency.add(message.author.id, -item.buyPrice);
    await user.addItem(item);

    message.channel.send(new Discord.MessageEmbed().setTitle('Shop').setDescription(`You've bought 1x ${getItemName(item)}`));
};