const Discord = require('discord.js');
const { random, getItemName, getSkillLevel } = require('../utils');
const { Op } = require('sequelize');

module.exports = async function(message, Users, CurrencyShop, timestamps, now, cooldownAmount) {
    const user = await Users.findOne({ where: { user_id: message.author.id } });
    const pickaxeItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: 'Iron Pickaxe' } } });
    const userPickaxe = await user.hasItem(pickaxeItem);
    if(!userPickaxe) {
        message.channel.send(new Discord.MessageEmbed().setTitle('⛏ Mining ⛏').setDescription(`${message.author}, you need \`⛏ Pickaxe\` to mine!`));
        return;
    }
    let minedItem = random(1, 4);
    if(getSkillLevel('Mining', user.mining_skill) < 2) {
        minedItem = random(1, 2);
    }
    else if(getSkillLevel('Mining', user.mining_skill) < 3) {
        minedItem = random(1, 3);
    }
    else if(getSkillLevel('Mining', user.mining_skill) < 4) {
        minedItem = random(1, 4);
    }
    const minedItemQuantity = random(1, 3);
    const minedXP = minedItemQuantity * random(1, 2);
    switch (minedItem) {
        case 1:
            minedItem = 'Coal';
            minedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: minedItem } } });
            break;
        case 2:
            minedItem = 'Iron Ore';
            minedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: minedItem } } });
            break;
        case 3:
            minedItem = 'Copper Ore';
            minedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: minedItem } } });
            break;
        case 4:
            minedItem = 'Gold Ore';
            minedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: minedItem } } });
            break;
        default:
            break;
    }
    await user.addItem(minedItem, minedItemQuantity);
    user.mining_skill += minedXP;
    user.save();
    let userPickaxeItem = await user.getItem(pickaxeItem);
    userPickaxeItem.durability -= 1;
    userPickaxeItem.save();
    if(userPickaxeItem.durability <= 0) {
        message.channel.send(new Discord.MessageEmbed().setTitle('⛏ Mining ⛏').setDescription(`${getItemName(pickaxeItem)} broke.`));
        await user.removeItem(pickaxeItem);
        const hasPickaxe = await user.hasItem(pickaxeItem);
        if(hasPickaxe) {
            userPickaxeItem = await user.getItem(pickaxeItem);
            userPickaxeItem.durability = pickaxeItem.durability;
            userPickaxeItem.save();
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    return message.channel.send(new Discord.MessageEmbed().setTitle('⛏ Mining ⛏').setDescription(`${message.author}, you have mined ${minedItemQuantity}x ${getItemName(minedItem)} and gained ${minedXP}XP`));
};