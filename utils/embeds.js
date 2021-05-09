const Discord = require('discord.js');
const fs = require('fs');
const Commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    Commands.set(file.slice(0, -3), command);
}

exports.pleaseWait = function(message, timeLeft, time, command) {
    return(new Discord.MessageEmbed()
        .setTitle('Please wait')
        .setDescription(`${message.author}, please wait ${timeLeft.toFixed(1)}${time} before reusing the \`${command}\` command.`));
};

exports.balance = function(target, currency) {
    return(new Discord.MessageEmbed()
        .setTitle(`:coin: ${target.tag} Balance :coin:`)
        .setDescription(`${target} has ${currency.getBalance(target.id)}:coin:`));
};

exports.leaderboard = function(list) {
    return(new Discord.MessageEmbed()
        .setTitle(':coin: **Leaderboard** :coin:')
        .setDescription(list));
};

exports.error = function() {
    return(new Discord.MessageEmbed()
        .setTitle(':warning: **Error occured** :warning:')
        .setDescription('Error has occured while executing command.\nContact staff if this occurs more often.'));
};

exports.aboutBot = function(prefix, version) {
    return(new Discord.MessageEmbed()
        .setTitle(':robot: DGB :robot:')
        .setDescription('Quite unique game bot on Discord')
        .addField('Author', 'Titas#5726', true)
        .addField('Version', version, true));
};

exports.gitHub = function() {
    return(new Discord.MessageEmbed()
        .setTitle(':robot: DGB Repository :robot:')
        .setDescription('This bot has repository on [GitHub](https://github.com/TitasPi/discordgamebot)'));
};

exports.help = function(prefix) {
    return(new Discord.MessageEmbed()
        .setTitle(':question: **Help** :question:')
        .setDescription(Commands.map((cmd) => `**${prefix}${cmd.name}** - ${cmd.description}`)));
};

exports.about = function(userData, Currency) {
    return(new Discord.MessageEmbed()
        .setTitle(`About ${userData.tag}`)
        .addField(`Information about ${userData.tag}`, '\u200b')
        .addField(':coin: Coins', `${Currency.getBalance(userData.id)} :coin:`, true)
        .addField('❤ Health', `${userData.health}/${userData.maxHealth}`, true)
        .addField('Skills', '\u200b')
        .addField('⛏ Mining', `${userData.mining_skill[0]}XP | ${userData.mining_skill[1]} Level`, true)
        .addField('🪓 Woodcutting', `${userData.woodcutting_skill[0]}XP | ${userData.woodcutting_skill[1]} Level`, true)
        .addField('🎣 Fishing', `${userData.fishing_skill[0]}XP | ${userData.fishing_skill[1]} Level`, true)
        .addField('🍳 Cooking', `${userData.cooking_skill[0]}XP | ${userData.cooking_skill[1]} Level`, true)
        .addField('🔥 Smithing', `${userData.smithing_skill[0]}XP | ${userData.smithing_skill[1]} Level`, true)
        .addField('⚒ Crafting', `${userData.crafting_skill[0]}XP | ${userData.crafting_skill[1]} Level`, true)
        .addField('⚔ Attack', `${userData.attack_skill[0]}XP | ${userData.attack_skill[1]} Level`, true)
        .addField('♥ Hitpoints', `${userData.hitpoint_skill[0]}XP | ${userData.hitpoint_skill[1]} Level`, true)
        .addField('🏠 House', userData.house));
};