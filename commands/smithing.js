const Discord = require('discord.js');
const { getSkillLevel } = require('../utils/utils');
const Logger = require('../utils/logger');
const Embeds = require('../utils/embeds');

exports.name = 'smithing';
exports.description = 'Shows smithing stats';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PetShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    try {
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
    }
    catch (error) {
        Logger.error(`Caught error while executing '${this.name}' command: ${error}`);
        message.channel.send(Embeds.error());
    }
};