const Discord = require('discord.js');
const { random } = require('../utils/utils');
const { Op } = require('sequelize');
const Logger = require('../utils/logger');
const Embeds = require('../utils/embeds');

exports.name = 'loot';
exports.description = 'Loot items';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PetShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    try {
        const user = await Users.findOne({ where: { user_id: message.author.id } });
        if(user.action != 'Idle') {
            return message.channel.send(`You are currently \`${user.action}\``);
        }
        let lootedItem = random(1, 100);
        let lootedItemQuantity = -1;
        if(lootedItem < 10) {
            lootedItem = '';
        }
        else if(lootedItem < 35) {
            lootedItem = '📰 Newspaper';
            lootedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: lootedItem } } });
            lootedItemQuantity = random(1, 3);
        }
        else if(lootedItem < 50) {
            lootedItem = '🏀 Basketball ball';
            lootedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: lootedItem } } });
            lootedItemQuantity = 1;
        }
        else if(lootedItem < 60) {
            lootedItem = '👠 Shoe';
            lootedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: lootedItem } } });
            lootedItemQuantity = random(1, 2);
        }
        else if(lootedItem < 70) {
            lootedItem = '☂ Umbrella';
            lootedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: lootedItem } } });
            lootedItemQuantity = 1;
        }
        else if(lootedItem < 90) {
            lootedItem = ':thread: String';
            lootedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: lootedItem } } });
            lootedItemQuantity = 1;
        }
        else {
            lootedItem = '🦨';
        }
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        if(lootedItemQuantity < 0 && lootedItem === '🦨') {
            return message.channel.send(new Discord.MessageEmbed()
                .setTitle('Loot')
                .setDescription(`You have been skunked ${lootedItem} while looting`));
        }
        if(lootedItemQuantity < 0 && lootedItem === '') {
            return message.channel.send(new Discord.MessageEmbed()
                .setTitle('Loot')
                .setDescription('You did not find anything'));
        }
        user.addItem(lootedItem, lootedItemQuantity);
        const randomMessages = [
            `While walking down the road, you found **${lootedItemQuantity}x ${lootedItem.name}**, ${message.author}`,
            `Kid walked up to you and gave you **${lootedItemQuantity}x ${lootedItem.name}**, ${message.author}`,
            `You found **${lootedItemQuantity}x ${lootedItem.name}**, ${message.author}`,
            `While waiting for a bus, you found **${lootedItemQuantity}x ${lootedItem.name}**, ${message.author}`,
            `Some person gave you away **${lootedItemQuantity}x ${lootedItem.name}**, ${message.author}`,
        ];
        message.channel.send(new Discord.MessageEmbed()
            .setTitle('Loot')
            .setDescription(randomMessages[random(0, randomMessages.length - 1)]));
    }
    catch (error) {
        Logger.error(`Caught error while executing '${this.name}' command: ${error}`);
        message.channel.send(Embeds.error());
    }
};