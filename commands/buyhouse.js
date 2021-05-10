const Discord = require('discord.js');
const { Op } = require('sequelize');
const Logger = require('../utils/logger');
const Embeds = require('../utils/embeds');

exports.name = 'buyhouse';
exports.description = 'Buys house from house shop';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PetShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    try {
        const item = await HouseShop.findOne({ where: { name: { [Op.like]: `%${commandArgs}%` }, buyable: 1 } });
        if (!item) return message.channel.send(new Discord.MessageEmbed().setTitle('🛒 Shop 🏬').setDescription('This house doesn\'t exist.'));
        if (item.buyPrice > Currency.getBalance(message.author.id)) {
            return message.channel.send(new Discord.MessageEmbed().setTitle('🛒 Shop 🏬').setDescription(`You don't have enough currency, ${message.author}`));
        }

        const user = await Users.findOne({ where: { user_id: message.author.id } });
        const userHouse = await user.hasHouse(item);
        if (userHouse) {
            return message.channel.send(new Discord.MessageEmbed().setTitle('🛒 Shop 🏬').setDescription(`You already own this house, ${message.author}`));
        }
        Currency.add(message.author.id, -item.buyPrice);
        await user.addHouse(item);

        message.channel.send(new Discord.MessageEmbed().setTitle('🛒 Shop 🏬').setDescription(`You've bought **${item.name}** for ${item.buyPrice} :coin:`));
    }
    catch (error) {
        Logger.error(`Caught error while executing '${this.name}' command: ${error}`);
        message.channel.send(Embeds.error());
    }
};