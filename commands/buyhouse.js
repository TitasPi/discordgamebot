const Discord = require('discord.js');
const { Op } = require('sequelize');

// eslint-disable-next-line no-unused-vars
module.exports = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    const item = await HouseShop.findOne({ where: { name: { [Op.like]: `%${commandArgs}%` }, buyable: 1 } });
    if (!item) return message.channel.send(new Discord.MessageEmbed().setTitle('🏠 Houses 🏠').setDescription('This house doesn\'t exist.'));
    if (item.buyPrice > Currency.getBalance(message.author.id)) {
        return message.channel.send(new Discord.MessageEmbed().setTitle('🏠 Houses 🏠').setDescription(`You don't have enough currency, ${message.author}`));
    }

    const user = await Users.findOne({ where: { user_id: message.author.id } });
    const userHouse = await user.hasHouse(item);
    if (userHouse) {
        return message.channel.send(new Discord.MessageEmbed().setTitle('🏠 Houses 🏠').setDescription(`You already own this house, ${message.author}`));
    }
    Currency.add(message.author.id, -item.buyPrice);
    await user.addHouse(item);

    message.channel.send(new Discord.MessageEmbed().setTitle('🏠 Houses 🏠').setDescription(`You've bought **${item.name}** for ${item.buyPrice} :coin:`));
};