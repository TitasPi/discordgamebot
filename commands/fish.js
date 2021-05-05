const Discord = require('discord.js');
const { random, getItemName, getSkillLevel } = require('../utils');
const { Op } = require('sequelize');

module.exports = async function(message, Users, CurrencyShop, timestamps, now, cooldownAmount) {
    const user = await Users.findOne({ where: { user_id: message.author.id } });
    const fishingRodItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: 'Fishing Rod' } } });
    const userFishingRod = await user.hasItem(fishingRodItem);
    if(!userFishingRod) {
        message.channel.send(new Discord.MessageEmbed().setTitle('🎣 Fishing 🎣').setDescription(`${message.author}, you need **🎣 Fishing Rod** to mine!`));
        return;
    }
    let fishedItem = random(1, 2);
    if(getSkillLevel('Fishing', user.fishing_skill) < 2) {
        fishedItem = 1;
    }
    else if(getSkillLevel('Fishing', user.fishing_skill) < 3) {
        fishedItem = random(1, 2);
    }
    else if(getSkillLevel('Fishing', user.fishing_skill) < 5) {
        fishedItem = random(1, 3);
    }
    else if(getSkillLevel('Fishing', user.fishing_skill) < 10) {
        fishedItem = random(1, 4);
    }
    else if(getSkillLevel('Fishing', user.fishing_skill) < 15) {
        fishedItem = random(1, 5);
    }
    if(random(1, 100) < 10) {
        fishedItem = 0;
    }
    const fishedItemQuantity = random(1, 3);
    const fishedXP = fishedItemQuantity * random(1, 2);
    switch (fishedItem) {
        case 0:
            fishedItem = '👠 Shoe';
            fishedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: fishedItem } } });
            user.addItem(fishedItem);
            return message.channel.send(new Discord.MessageEmbed().setTitle('🎣 Fishing 🎣').setDescription(`You have caught **${fishedItem.name}**`));
        case 1:
            fishedItem = 'Raw Cod';
            fishedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: fishedItem } } });
            break;
        case 2:
            fishedItem = 'Raw Salmon';
            fishedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: fishedItem } } });
            break;
        case 3:
            fishedItem = 'Raw Carp';
            fishedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: fishedItem } } });
            break;
        case 4:
            fishedItem = 'Raw Mackerel';
            fishedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: fishedItem } } });
            break;
        case 5:
            fishedItem = 'Raw Herring';
            fishedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: fishedItem } } });
            break;
        case 6:
            fishedItem = 'Raw Trout';
            fishedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: fishedItem } } });
            break;
        default:
            break;
    }
    await user.addItem(fishedItem, fishedItemQuantity);
    user.fishing_skill += fishedXP;
    user.save();
    let userFishingRodItem = await user.getItem(fishingRodItem);
    userFishingRodItem.durability -= 1;
    userFishingRodItem.save();
    if(userFishingRodItem.durability <= 0) {
        message.channel.send(new Discord.MessageEmbed().setTitle('🎣 Fishing 🎣').setDescription(`**${getItemName(fishingRodItem)}** broke.`));
        await user.removeItem(fishingRodItem);
        const hasAxe = await user.hasItem(fishingRodItem);
        if(hasAxe) {
            userFishingRodItem = await user.getItem(fishingRodItem);
            userFishingRodItem.durability = fishingRodItem.durability;
            userFishingRodItem.save();
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    return message.channel.send(new Discord.MessageEmbed().setTitle('🎣 Fishing 🎣').setDescription(`You have caught ${fishedItemQuantity}x ${getItemName(fishedItem)} and gained ${fishedXP}XP`));
};