const Discord = require('discord.js');
const { Op } = require('sequelize');

module.exports = async function(message, currency, commandArgs, HouseShop, Users) {
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
    currency.add(message.author.id, item.sellPrice);
    await user.removeHouse(item);

    message.channel.send(new Discord.MessageEmbed().setTitle('🏠 Houses 🏠').setDescription(`You've sold **${item.name}** for ${item.sellPrice} :coin:`));
};