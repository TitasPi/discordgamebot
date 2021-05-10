const Discord = require('discord.js');
const { getSkillLevel } = require('../utils/utils');
const Logger = require('../utils/logger');
const Embeds = require('../utils/embeds');

exports.name = 'crafting';
exports.description = 'Shows crafting stats';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PetShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    try {
        const user = await Users.findOne({ where: { user_id: message.author.id } });
        let level = 1;
        if(!user) {
            level = 1;
        }
        else {
            level = getSkillLevel('Crafting', user.crafting_skill);
        }
        message.channel.send(new Discord.MessageEmbed()
            .setTitle('About crafting')
            .setDescription('Gain xp while crafting items.')
            .addField('🎣 Fishing Rod', '1x **🌳 Logs**, 1x **:thread: String**')
            .addField('⛏ Iron Pickaxe', '2x **🌳 Logs**, 1x **🧱 Iron Ingot**')
            .addField('🪓 Iron Axe', '2x **🌳 Logs**, 1x **🧱 Iron Ingot**')
            .addField('⛏ Copper Pickaxe', '2x **🌳 Logs**, 1x **🧱 Copper Ingot**')
            .addField('🪓 Copper Axe', '2x **🌳 Logs**, 1x **🧱 Copper Ingot**'));
        return message.channel.send(new Discord.MessageEmbed()
            .setTitle('Crafting')
            .setDescription(`${message.author}, your level is ${level}`));
    }
    catch (error) {
        Logger.error(`Caught error while executing '${this.name}' command: ${error}`);
        message.channel.send(Embeds.error());
    }
};