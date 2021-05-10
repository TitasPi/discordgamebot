const Discord = require('discord.js');
const { getSkillLevel } = require('../utils/utils');
const Logger = require('../utils/logger');
const Embeds = require('../utils/embeds');

exports.name = 'woodcutting';
exports.description = 'Shows woodcutting stats';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PetShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    try {
        const user = await Users.findOne({ where: { user_id: message.author.id } });
        let level = 1;
        if(!user) {
            level = 1;
        }
        else {
            level = getSkillLevel('Woodcutting', user.woodcutting_skill);
        }
        message.channel.send(new Discord.MessageEmbed()
            .setTitle('🪓 About woodcutting 🪓')
            .setDescription('Gain xp while chopping wood.')
            .addField('1 Level', 'Ability to chop oak logs')
            .addField('2 Level', 'Ability to chop birch logs')
            .addField('3 Level', 'Ability to chop willow and maple logs'));
        return message.channel.send(new Discord.MessageEmbed()
            .setTitle('Woodcutting')
            .setDescription(`${message.author}, your level is ${level}`));
    }
    catch (error) {
        Logger.error(`Caught error while executing '${this.name}' command: ${error}`);
        message.channel.send(Embeds.error());
    }
};