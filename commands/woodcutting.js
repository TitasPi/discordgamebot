const Discord = require('discord.js');
const { getSkillLevel } = require('../utils');

module.exports = async function(message, Users) {
    const user = await Users.findOne({ where: { user_id: message.author.id } });
    let level = 1;
    if(!user) {
        level = 1;
    }
    else {
        level = getSkillLevel('Woodcutting', user.woodcutting_skill);
    }
    message.channel.send(new Discord.MessageEmbed()
        .setTitle('About woodcutting')
        .setDescription('Gain xp while chopping wood.')
        .addField('1 Level', 'Ability to chop oak logs')
        .addField('2 Level', 'Ability to chop birch logs')
        .addField('3 Level', 'Ability to chop willow and maple logs'));
    return message.channel.send(new Discord.MessageEmbed()
        .setTitle('Woodcutting')
        .setDescription(`${message.author}, your level is ${level}`));
};