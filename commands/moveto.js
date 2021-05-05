const Discord = require('discord.js');
const { Op } = require('sequelize');

module.exports = async function(message, HouseShop, commandArgs, Users) {
    const house = await HouseShop.findOne({ where: { name: { [Op.like]: `%${commandArgs}%` } } });
    if(!house) return message.channel.send(new Discord.MessageEmbed().setTitle('🏠 Houses 🏠').setDescription('That house doesn\'t exist.'));
    const user = await Users.findOne({ where: { user_id: message.author.id } });
    const userHouse = await user.hasHouse(house);
    if(!userHouse) {
        return message.channel.send(new Discord.MessageEmbed().setTitle('🏠 Houses 🏠').setDescription('You do not own this house'));
    }

    user.house = house.name;
    user.save();

    message.channel.send(new Discord.MessageEmbed().setTitle('🏠 Houses 🏠').setDescription(`You moved to ${house.name}`));
};