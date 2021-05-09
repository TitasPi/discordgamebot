const Discord = require('discord.js');
const { random, getItemName, getSkillLevel } = require('../utils/utils');
const { Op } = require('sequelize');

exports.name = 'fish';
exports.description = 'Fish some fishes';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PetShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    const user = await Users.findOne({ where: { user_id: message.author.id } });

    const fishingRodItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: 'Fishing Rod' } } });
    const userFishingRod = await user.hasItem(fishingRodItem);
    if(!userFishingRod) {
        message.channel.send(new Discord.MessageEmbed().setTitle('🎣 Fishing 🎣').setDescription(`${message.author}, you need **🎣 Fishing Rod** to mine!`));
        return;
    }

    let fishedItem = getFishedItem(user.fishing_skill);
    const fishedItemQuantity = random(1, 3);
    const fishedXP = fishedItemQuantity * random(1, 2);

    fishedItem = getFishedItemName(fishedItem);
    fishedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: fishedItem } } });

    await user.addItem(fishedItem, fishedItemQuantity);
    user.fishing_skill += fishedXP;
    user.save();
    let userFishingRodItem = await user.getItem(fishingRodItem);
    userFishingRodItem.durability -= 1;
    userFishingRodItem.save();
    if(userFishingRodItem.durability <= 0) {
        message.channel.send(new Discord.MessageEmbed().setTitle('🎣 Fishing 🎣').setDescription(`**${getItemName(fishingRodItem)}** broke.`));
        await user.removeItem(fishingRodItem);
        const hasFishingRod = await user.hasItem(fishingRodItem);
        if(hasFishingRod) {
            userFishingRodItem = await user.getItem(fishingRodItem);
            userFishingRodItem.durability = fishingRodItem.durability;
            userFishingRodItem.save();
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    return message.channel.send(new Discord.MessageEmbed().setTitle('🎣 Fishing 🎣').setDescription(`You have caught ${fishedItemQuantity}x ${getItemName(fishedItem)} and gained ${fishedXP}XP`));
};

function getFishedItem(userSkillLevel) {
    let fishedItem = random(1, 2);
    if(getSkillLevel('Fishing', userSkillLevel) < 2) {
        fishedItem = 1;
    }
    else if(getSkillLevel('Fishing', userSkillLevel) < 3) {
        fishedItem = random(1, 2);
    }
    else if(getSkillLevel('Fishing', userSkillLevel) < 5) {
        fishedItem = random(1, 3);
    }
    else if(getSkillLevel('Fishing', userSkillLevel) < 10) {
        fishedItem = random(1, 4);
    }
    else if(getSkillLevel('Fishing', userSkillLevel) < 15) {
        fishedItem = random(1, 5);
    }
    if(random(1, 100) < 10) {
        fishedItem = 0;
    }

    return fishedItem;
}
function getFishedItemName(fishedItemNr) {
    switch (fishedItemNr) {
        case 0:
            return '👠 Shoe';
        case 1:
            return 'Raw Cod';
        case 2:
            return 'Raw Salmon';
        case 3:
            return 'Raw Carp';
        case 4:
            return 'Raw Mackerel';
        case 5:
            return 'Raw Herring';
        case 6:
            return 'Raw Trout';
    }
}