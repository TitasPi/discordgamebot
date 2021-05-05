const Discord = require('discord.js');
const { getSkillLevel } = require('../utils');

module.exports = async function(message, Users) {
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
};