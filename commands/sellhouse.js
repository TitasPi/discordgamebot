const Discord = require('discord.js');
const { Op } = require('sequelize');

exports.name = 'sellhouse';
exports.description = 'Sell house';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    const item = await HouseShop.findOne({ where: { name: { [Op.like]: `%${commandArgs}%` }, sellable: 1 } });
    if (!item) return message.channel.send(new Discord.MessageEmbed().setTitle('🏠 Houses 🏠').setDescription('This house doesn\'t exist.'));
    const user = await Users.findOne({ where: { user_id: message.author.id } });
    const userHouse = await user.hasHouse(item);
    if (!userHouse) {
        return message.channel.send(new Discord.MessageEmbed().setTitle('🏠 Houses 🏠').setDescription(`You do not own this house, ${message.author}`));
    }
    if(user.house === item.name) {
        user.house = 'Homeless';
        user.save();
    }
    Currency.add(message.author.id, item.sellPrice);
    await user.removeHouse(item);

    message.channel.send(new Discord.MessageEmbed().setTitle('🏠 Houses 🏠').setDescription(`You've sold **${item.name}** for ${item.sellPrice} :coin:`));
};