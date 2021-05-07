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

    const user = await Users.findOne({ where: { user_id: message.author.id } });

    if(item.name === 'Iron Axe' || item.name === 'Iron Pickaxe' || item.name === 'Copper Axe' || item.name === 'Copper Pickaxe' || item.name === 'Fishing Rod') {
        // First crafting component
        const logItem = await user.getUserLogs();
        const woodItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: logItem } } });
        const userWoodItem = await user.hasItem(woodItem);

        // Second crafting component
        const secondComponent = await getSecondComponent(CurrencyShop, item.name);
        const secondComponentAmount = await getSecondComponentAmount(item.name);
        const userSecondComponent = await user.hasItem(secondComponent, secondComponentAmount);

        let missing = '';
        if(userSecondComponent && !userWoodItem) {
            missing = '1x Log';
        }
        else if(!userSecondComponent && !userWoodItem) {
            missing = `1x Log, ${secondComponentAmount}x ${secondComponent.name}`;
        }
        else if(!userSecondComponent && userWoodItem) {
            missing = `${secondComponentAmount}x ${secondComponent.name}`;
        }
        if(missing !== '') {
            return message.channel.send(new Discord.MessageEmbed().setTitle('Crafting').setDescription(`You need to have \`${missing}\` to craft \`${getItemName(item)}\``));
        }

        await user.removeItem(woodItem);
        await user.removeItem(secondComponent, secondComponentAmount);
        await user.addItem(item);
        const xp = random(1, 5);
        user.crafting_skill += xp;
        user.save();
        return message.channel.send(new Discord.MessageEmbed().setTitle('Crafting').setDescription(`You crafted 1x **${getItemName(item)}** (used 1x **${getItemName(woodItem)}** and ${secondComponentAmount}x **${getItemName(secondComponent)}**). Gained ${xp}XP`));
    }
    else {
        return message.channel.send(new Discord.MessageEmbed().setTitle('Crafting').setDescription('I can\'t craft that'));
    }
};

async function getSecondComponent(CurrencyShop, itemName) {
    if(itemName === 'Iron Axe' || itemName === 'Iron Pickaxe') {
        return await CurrencyShop.findOne({ where: { name: { [Op.like]: 'Iron Ingot' } } });
    }
    if(itemName === 'Copper Axe' || itemName === 'Copper Pickaxe') {
        return await CurrencyShop.findOne({ where: { name: { [Op.like]: 'Copper Ingot' } } });
    }
    if(itemName === 'Fishing Rod') {
        return await CurrencyShop.findOne({ where: { name: { [Op.like]: ':thread: String' } } });
    }
}
async function getSecondComponentAmount(itemName) {
    if(itemName === 'Iron Axe' || itemName === 'Iron Pickaxe' || itemName === 'Copper Axe' || itemName === 'Copper Pickaxe') {
        return 2;
    }
    if(itemName === 'Fishing Rod') {
        return 1;
    }
}