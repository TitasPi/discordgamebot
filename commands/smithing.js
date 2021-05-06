const Discord = require('discord.js');
const { getSkillLevel } = require('../utils');

// eslint-disable-next-line no-unused-vars
module.exports = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    const user = await Users.findOne({ where: { user_id: message.author.id } });
    let level = 1;
    if(!user) {
        level = 1;
    }
    else {
        level = getSkillLevel('Smithing', user.smithing_skillXP);
    }
    message.channel.send(new Discord.MessageEmbed()
        .setTitle('⚒ About smithing ⚒')
        .setDescription('Gain xp while smelting ores into ingots.')
        .addField('1 Level', 'Ability to smelt iron ores')
        .addField('2 Level', 'Ability to smelt copper ores')
        .addField('3 Level', 'Ability to smelt gold ores'));
    return message.channel.send(new Discord.MessageEmbed()
        .setTitle('Smithing')
        .setDescription(`${message.author}, your level is ${level}`));
};