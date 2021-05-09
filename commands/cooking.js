const Discord = require('discord.js');
const { getSkillLevel } = require('../utils/utils');

exports.name = 'cooking';
exports.description = 'Shows cooking stats';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PetShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    const user = await Users.findOne({ where: { user_id: message.author.id } });
    let level = 1;
    if(!user) {
        level = 1;
    }
    else {
        level = getSkillLevel('Cooking', user.cooking_skillXP);
    }
    message.channel.send(new Discord.MessageEmbed()
        .setTitle('About cooking')
        .setDescription('Gain xp while cooking food.')
        .addField('1 Level', 'Ability to chop oak logs')
        .addField('2 Level', 'Ability to chop birch logs')
        .addField('3 Level', 'Ability to chop willow and maple logs'));
    return message.channel.send(new Discord.MessageEmbed()
        .setTitle('Cooking')
        .setDescription(`${message.author}, your level is ${level}`));
};