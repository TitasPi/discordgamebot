const Discord = require('discord.js');
const { getSkillLevel, getMaxHP, getItemName } = require('../utils/utils');
const { Op } = require('sequelize');
const Logger = require('../utils/logger');
const Embeds = require('../utils/embeds');

exports.name = 'eat';
exports.description = 'Eat food';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PetShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    try {
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
    }
    catch (error) {
        Logger.error(`Caught error while executing '${this.name}' command: ${error}`);
        message.channel.send(Embeds.error());
    }
};