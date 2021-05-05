const Discord = require('discord.js');
const { Op } = require('sequelize');

module.exports = async function(message, currency, commandArgs, HouseShop, Users) {
    const item = await HouseShop.findOne({ where: { name: { [Op.like]: `%${commandArgs}%` }, buyable: 1 } });
    if (!item) return message.channel.send(new Discord.MessageEmbed().setTitle('🏠 Houses 🏠').setDescription('This house doesn\'t exist.'));
    if (item.buyPrice > currency.getBalance(message.author.id)) {
        return message.channel.send(new Discord.MessageEmbed().setTitle('🏠 Houses 🏠').setDescription(`You don't have enough currency, ${message.author}`));
    }

    const user = await Users.findOne({ where: { user_id: message.author.id } });
    const userHouse = await user.hasHouse(item);
    if (userHouse) {
        return message.channel.send(new Discord.MessageEmbed().setTitle('🏠 Houses 🏠').setDescription(`You already own this house, ${message.author}`));
    }
    currency.add(message.author.id, -item.buyPrice);
    await user.addHouse(item);

    message.channel.send(new Discord.MessageEmbed().setTitle('🏠 Houses 🏠').setDescription(`You've bought **${item.name}** for ${item.buyPrice} :coin:`));
};