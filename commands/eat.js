const Discord = require('discord.js');
const { getSkillLevel, getMaxHP, getItemName } = require('../utils');
const { Op } = require('sequelize');

exports.name = 'eat';
exports.description = 'Eat food';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    const user = await Users.findOne({ where: { user_id: message.author.id } });
    const foodItem = await UserItems.findOne({
        where: {
            user_id: message.author.id,
            amount: { [Op.gte]: 1 },
        },
        include: {
            model: CurrencyShop,
            as: 'item',
            where: {
                name: { [Op.like]: `%${commandArgs}%` },
            },
            order: [
                ['id', 'ASC'],
            ],
        },
    });
    if(!foodItem) {
        message.channel.send(new Discord.MessageEmbed().setTitle('🍒 Eating 🍩').setDescription(`${message.author}, you can't eat that!`));
        return;
    }
    await user.removeItem(foodItem.item);
    const leftToMax = getMaxHP(getSkillLevel('Hitpoints', user.hitpoint_skill)) - user.health;
    if(foodItem.item.healing > leftToMax) {
        user.health += leftToMax;
        await user.save();
        return message.channel.send(new Discord.MessageEmbed().setTitle('🍒 Eating 🍩').setDescription(`${message.author}, you ate 1x **${getItemName(foodItem.item)}** and healed ${leftToMax}HP`));
    }
    else {
        user.health += foodItem.item.healing;
        await user.save();
        return message.channel.send(new Discord.MessageEmbed().setTitle('🍒 Eating 🍩').setDescription(`${message.author}, you ate 1x **${getItemName(foodItem.item)}** and healed ${foodItem.item.healing}HP`));
    }
};