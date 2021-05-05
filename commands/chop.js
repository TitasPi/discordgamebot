const Discord = require('discord.js');
const { random, getItemName, getSkillLevel } = require('../utils');
const { Op } = require('sequelize');

module.exports = async function(message, Users, CurrencyShop, timestamps, now, cooldownAmount) {
    const user = await Users.findOne({ where: { user_id: message.author.id } });
    const axeItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: 'Iron Axe' } } });
    const userAxe = await user.hasItem(axeItem);
    if(!userAxe) {
        message.channel.send(new Discord.MessageEmbed().setTitle('🪓 Woodcutting 🪓').setDescription(`${message.author}, you need \`🪓 Axe\` to chop down wood!`));
        return;
    }
    let choppedItem = random(1, 4);
    if(getSkillLevel('Woodcutting', user.woodcutting_skill) < 2) {
        choppedItem = random(1, 1);
    }
    else if(getSkillLevel('Woodcutting', user.woodcutting_skill) < 3) {
        choppedItem = random(1, 2);
    }
    else if(getSkillLevel('Woodcutting', user.woodcutting_skill) < 4) {
        choppedItem = random(1, 4);
    }
    const choppedItemQuantity = random(1, 3);
    const choppedXP = choppedItemQuantity * random(1, 2);
    switch (choppedItem) {
    case 1:
        choppedItem = 'Oak Log';
        choppedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: choppedItem } } });
        break;
    case 2:
        choppedItem = 'Birch Log';
        choppedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: choppedItem } } });
        break;
    case 3:
        choppedItem = 'Willow Log';
        choppedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: choppedItem } } });
        break;
    case 4:
        choppedItem = 'Maple Log';
        choppedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: choppedItem } } });
        break;
    default:
        break;
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    await user.addItem(choppedItem, choppedItemQuantity);
    user.woodcutting_skill += choppedXP;
    user.save();
    let userAxeItem = await user.getItem(axeItem);
    userAxeItem.durability -= 1;
    userAxeItem.save();
    if(userAxeItem.durability <= 0) {
        message.channel.send(new Discord.MessageEmbed().setTitle('🪓 Woodcutting 🪓').setDescription(`${getItemName(axeItem)} broke.`));
        await user.removeItem(axeItem);
        const hasAxe = await user.hasItem(axeItem);
        if(hasAxe) {
            userAxeItem = await user.getItem(axeItem);
            userAxeItem.durability = axeItem.durability;
            userAxeItem.save();
        }
    }
    return message.channel.send(new Discord.MessageEmbed().setTitle('🪓 Woodcutting 🪓').setDescription(`You have chopped ${choppedItemQuantity}x ${getItemName(choppedItem)} and gained ${choppedXP}XP`));
};