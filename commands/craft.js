const Discord = require('discord.js');
const { getItemName, random } = require('../utils');
const { Op } = require('sequelize');

exports.name = 'craft';
exports.description = 'Craft item';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    let item = '';
    if(commandArgs === 'axe' || commandArgs === 'Axe') {
        item = await CurrencyShop.findOne({ where: { name: { [Op.like]: 'Iron Axe' } } });
    }
    else {
        item = await CurrencyShop.findOne({ where: { name: { [Op.like]: `%${commandArgs}%` } } });
    }
    if (!item) return message.channel.send(new Discord.MessageEmbed().setTitle('Crafting').setDescription('That item doesn\'t exist.'));
    if(item.name === 'Iron Axe') {
        const user = await Users.findOne({ where: { user_id: message.author.id } });
        const ironItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: 'Iron Ingot' } } });
        const userItem1 = await user.hasItem(ironItem, 2);
        const logItem = await user.getUserLogs();
        const woodItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: logItem } } });
        const userItem2 = await user.hasItem(woodItem);
        let missing = '';
        if(userItem1 && !userItem2) {
            missing += '1x Log';
        }
        else if(!userItem1 && !userItem2) {
            missing += `1x Log, 2x ${ironItem.name}`;
        }
        else if(!userItem1) {
            missing += `2x ${ironItem.name}`;
        }
        if(missing !== '') {
            return message.channel.send(new Discord.MessageEmbed().setTitle('Crafting').setDescription(`You need to have \`${missing}\` to craft \`${getItemName(item)}\``));
        }
        await user.removeItem(woodItem);
        await user.removeItem(ironItem, 2);
        await user.addItem(item);
        const xp = random(1, 5);
        user.crafting_skill += xp;
        user.save();
        return message.channel.send(new Discord.MessageEmbed().setTitle('Crafting').setDescription(`You crafted 1x ${getItemName(item)} (used 1x ${getItemName(woodItem)}) and 2x ${getItemName(ironItem)}. Gained ${xp}XP`));
    }
    else if(item.name === 'Iron Pickaxe') {
        const user = await Users.findOne({ where: { user_id: message.author.id } });
        const ironItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: 'Iron Ingot' } } });
        const userItem1 = await user.hasItem(ironItem, 2);
        const logItem = await user.getUserLogs();
        const woodItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: logItem } } });
        const userItem2 = await user.hasItem(woodItem);
        let missing = '';
        if(userItem1 && !userItem2) {
            missing += '1x Log';
        }
        else if(!userItem1 && !userItem2) {
            missing += `1x Log, 2x ${ironItem.name}`;
        }
        else if(!userItem1) {
            missing += `2x ${ironItem.name}`;
        }
        if(missing !== '') {
            return message.channel.send(new Discord.MessageEmbed().setTitle('Crafting').setDescription(`You need to have \`${missing}\` to craft \`${getItemName(item)}\``));
        }
        await user.removeItem(woodItem);
        await user.removeItem(ironItem, 2);
        await user.addItem(item);
        const xp = random(1, 5);
        user.crafting_skill += xp;
        user.save();
        return message.channel.send(new Discord.MessageEmbed().setTitle('Crafting').setDescription(`You crafted 1x ${getItemName(item)} (used 1x ${getItemName(woodItem)}) and 2x ${getItemName(ironItem)}. Gained ${xp}XP`));
    }
    else if(item.name === 'Copper Axe') {
        const user = await Users.findOne({ where: { user_id: message.author.id } });
        const ironItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: 'Copper Ingot' } } });
        const userItem1 = await user.hasItem(ironItem, 2);
        const logItem = await user.getUserLogs();
        const woodItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: logItem } } });
        const userItem2 = await user.hasItem(woodItem);
        let missing = '';
        if(userItem1 && !userItem2) {
            missing += '1x Log';
        }
        else if(!userItem1 && !userItem2) {
            missing += `1x Log, 2x ${ironItem.name}`;
        }
        else if(!userItem1) {
            missing += `2x ${ironItem.name}`;
        }
        if(missing !== '') {
            return message.channel.send(new Discord.MessageEmbed().setTitle('Crafting').setDescription(`You need to have \`${missing}\` to craft \`${getItemName(item)}\``));
        }
        await user.removeItem(woodItem);
        await user.removeItem(ironItem, 2);
        await user.addItem(item);
        const xp = random(1, 5);
        user.crafting_skill += xp;
        user.save();
        return message.channel.send(new Discord.MessageEmbed().setTitle('Crafting').setDescription(`You crafted 1x ${getItemName(item)} (used 1x ${getItemName(woodItem)}) and 2x ${getItemName(ironItem)}. Gained ${xp}XP`));
    }
    else if(item.name === 'Copper Pickaxe') {
        const user = await Users.findOne({ where: { user_id: message.author.id } });
        const ironItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: 'Copper Ingot' } } });
        const userItem1 = await user.hasItem(ironItem, 2);
        const logItem = await user.getUserLogs();
        const woodItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: logItem } } });
        const userItem2 = await user.hasItem(woodItem);
        let missing = '';
        if(userItem1 && !userItem2) {
            missing += '1x Log';
        }
        else if(!userItem1 && !userItem2) {
            missing += `1x Log, 2x ${ironItem.name}`;
        }
        else if(!userItem1) {
            missing += `2x ${ironItem.name}`;
        }
        if(missing !== '') {
            return message.channel.send(new Discord.MessageEmbed().setTitle('Crafting').setDescription(`You need to have \`${missing}\` to craft \`${getItemName(item)}\``));
        }
        await user.removeItem(woodItem);
        await user.removeItem(ironItem, 2);
        await user.addItem(item);
        const xp = random(1, 5);
        user.crafting_skill += xp;
        user.save();
        return message.channel.send(new Discord.MessageEmbed().setTitle('Crafting').setDescription(`You crafted 1x ${getItemName(item)} (used 1x ${getItemName(woodItem)}) and 2x ${getItemName(ironItem)}. Gained ${xp}XP`));
    }
    else if(item.name === 'Fishing Rod') {
        const user = await Users.findOne({ where: { user_id: message.author.id } });
        const stringItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: ':thread: String' } } });
        const userItem1 = await user.hasItem(stringItem);
        const logItem = await user.getUserLogs();
        const woodItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: logItem } } });
        const userItem2 = await user.hasItem(woodItem);
        let missing = '';
        if(userItem1 && !userItem2) {
            missing += '1x Log';
        }
        else if(!userItem1 && !userItem2) {
            missing += `1x Log, 1x ${stringItem.name}`;
        }
        else if(!userItem1) {
            missing += `1x ${stringItem.name}`;
        }
        if(missing !== '') {
            return message.channel.send(new Discord.MessageEmbed().setTitle('Crafting').setDescription(`You need to have **${missing}** to craft **${getItemName(item)}**`));
        }
        await user.removeItem(woodItem);
        await user.removeItem(stringItem);
        await user.addItem(item);
        const xp = random(1, 5);
        user.crafting_skill += xp;
        user.save();
        return message.channel.send(new Discord.MessageEmbed().setTitle('Crafting').setDescription(`You crafted 1x **${getItemName(item)}** (used 1x **${getItemName(woodItem)}** and 2x **${getItemName(stringItem)}**). Gained ${xp}XP`));
    }
    else {
        return message.channel.send(new Discord.MessageEmbed().setTitle('Crafting').setDescription('I can\'t craft that'));
    }
};