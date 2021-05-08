const Discord = require('discord.js');
const { random, getItemName } = require('../utils/utils');
const { Op } = require('sequelize');

exports.name = 'smelt';
exports.description = 'Smelt ores';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: `%${commandArgs}%` } } });
    if (!item) return message.channel.send(new Discord.MessageEmbed().setTitle('Smelting').setDescription('That item doesn\'t exist.'));
    if(item.name === 'Iron Ore' || item.name === 'Copper Ore' || item.name === 'Gold Ore') {
        const coalItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: 'Coal' } } });
        const user = await Users.findOne({ where: { user_id: message.author.id } });
        const userCoalItem = await user.hasItem(coalItem);
        const userOreItem = await user.hasItem(item);
        if (!userOreItem) {
            return message.channel.send(new Discord.MessageEmbed().setTitle('Smelting').setDescription(`You don't have ${getItemName(item)}.`));
        }
        if(!userCoalItem) {
            return message.channel.send(new Discord.MessageEmbed().setTitle('Smelting').setDescription(`You need to have \`${getItemName(coalItem)}\` to smelt \`${getItemName(item)}\``));
        }
        let ingotItem;
        switch (item.name) {
            case 'Iron Ore':
                ingotItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: 'Iron Ingot' } } });
                break;
            case 'Copper Ore':
                ingotItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: 'Copper Ingot' } } });
                break;
            case 'Gold Ore':
                ingotItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: 'Gold Ingot' } } });
                break;
            default:
                break;
        }
        await user.removeItem(item);
        await user.removeItem(coalItem);
        await user.addItem(ingotItem);
        const xp = random(1, 5);
        user.smithing_skill += xp;
        user.save();
        return message.channel.send(new Discord.MessageEmbed().setTitle('Smelting').setDescription(`You smelted 1x ${getItemName(item)} (used 1x ${getItemName(coalItem)}) and got 1x ${getItemName(ingotItem)}. Gained ${xp}XP`));

    }
    else {
        return message.channel.send(new Discord.MessageEmbed().setTitle('Smelting').setDescription('I can\'t smelt that'));
    }
};