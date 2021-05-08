const Discord = require('discord.js');
const { getMaxHP, getSkillLevel } = require('../utils/utils');

exports.name = 'about';
exports.description = 'Shows info about you';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    const target = message.mentions.users.first() || message.author;
    const user = await Users.findOne({ where: { user_id: target.id } });
    let house = 'Homeless';
    let health = 10;
    let woodcutting_skillXP = 0;
    let mining_skillXP = 0;
    let fishing_skillXP = 0;
    let cooking_skillXP = 0;
    let smithing_skillXP = 0;
    let crafting_skillXP = 0;
    let attack_skillXP = 0;
    let hitpoint_skillXP = 0;
    if(user) {
        house = user.house;
        health = user.health;
        woodcutting_skillXP = user.woodcutting_skill;
        mining_skillXP = user.mining_skill;
        fishing_skillXP = user.fishing_skill;
        cooking_skillXP = user.cooking_skill;
        smithing_skillXP = user.smithing_skill;
        crafting_skillXP = user.crafting_skill;
        attack_skillXP = user.attack_skill;
        hitpoint_skillXP = user.hitpoint_skill;
    }

    const aboutUser = new Discord.MessageEmbed().setTitle(`About ${target.tag}`);
    aboutUser.addField(`Information about ${target.tag}`, '\u200b');
    aboutUser.addField(':coin: Coins', `${Currency.getBalance(target.id)} :coin:`, true);
    aboutUser.addField('❤ Health', `${health}/${getMaxHP(getSkillLevel('Hitpoints', hitpoint_skillXP))}`, true);
    aboutUser.addField('Skills', '\u200b');
    aboutUser.addField('⛏ Mining', `${mining_skillXP}XP | ${getSkillLevel('Mining', mining_skillXP)} Level`, true);
    aboutUser.addField('🪓 Woodcutting', `${woodcutting_skillXP}XP | ${getSkillLevel('Woodcutting', woodcutting_skillXP)} Level`, true);
    aboutUser.addField('🎣 Fishing', `${fishing_skillXP}XP | ${getSkillLevel('Fishing', fishing_skillXP)} Level`, true);
    aboutUser.addField('🍳 Cooking', `${cooking_skillXP}XP | ${getSkillLevel('Cooking', cooking_skillXP)} Level`, true);
    aboutUser.addField('🔥 Smithing', `${smithing_skillXP}XP | ${getSkillLevel('Smithing', smithing_skillXP)} Level`, true);
    aboutUser.addField('⚒ Crafting', `${crafting_skillXP}XP | ${getSkillLevel('Crafting', crafting_skillXP)} Level`, true);
    aboutUser.addField('⚔ Attack', `${attack_skillXP}XP | ${getSkillLevel('Attack', crafting_skillXP)} Level`, true);
    aboutUser.addField('♥ Hitpoints', `${hitpoint_skillXP}XP | ${getSkillLevel('Hitpoints', crafting_skillXP)} Level`, true);
    aboutUser.addField('🏠 House', house);

    return message.channel.send(aboutUser);
};