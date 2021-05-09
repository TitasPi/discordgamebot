const Discord = require('discord.js');
const { getSkillLevel } = require('../utils/utils');

exports.name = 'mining';
exports.description = 'Shows mining stats';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PetShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    const user = await Users.findOne({ where: { user_id: message.author.id } });
    let level = 1;
    if(!user) {
        level = 1;
    }
    else {
        level = getSkillLevel('Mining', user.mining_skill);
    }
    message.channel.send(new Discord.MessageEmbed()
        .setTitle('⛏ About mining ⛏')
        .setDescription('Gain xp while mining ores.')
        .addField('1 Level', 'Ability to mine coal and iron ore')
        .addField('2 Level', 'Ability to mine copper')
        .addField('3 Level', 'Ability to mine gold'));
    return message.channel.send(new Discord.MessageEmbed()
        .setTitle('Mining')
        .setDescription(`${message.author}, your level is ${level}`));
};