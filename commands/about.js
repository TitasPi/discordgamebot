const Discord = require('discord.js');
const Utils = require('../utils');

module.exports = async function(Users, message, currency) {
	const target = message.mentions.users.first() || message.author;
	const user = await Users.findOne({ where: { user_id: target.id } });
	let house = '';
	let health = 10;
	let woodcutting_skillXP = 0;
	let mining_skillXP = 0;
	let fishing_skillXP = 0;
	let cooking_skillXP = 0;
	let smithing_skillXP = 0;
	let crafting_skillXP = 0;
	let attack_skillXP = 0;
	let hitpoint_skillXP = 0;
	if(!user) {
		house = 'Homeless';
	}
	else {
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
	aboutUser.addField(':coin: Coins', `${currency.getBalance(target.id)} :coin:`, true);
	aboutUser.addField('❤ Health', `${health}/${Utils.getMaxHP(Utils.getSkillLevel('Hitpoints', hitpoint_skillXP))}`, true);
	aboutUser.addField('Skils', '\u200b');
	aboutUser.addField('⛏ Mining', `${mining_skillXP}XP | ${Utils.getSkillLevel('Mining', mining_skillXP)} Level`, true);
	aboutUser.addField('🪓 Woodcutting', `${woodcutting_skillXP}XP | ${Utils.getSkillLevel('Woodcutting', woodcutting_skillXP)} Level`, true);
	aboutUser.addField('🎣 Fishing', `${fishing_skillXP}XP | ${Utils.getSkillLevel('Fishing', fishing_skillXP)} Level`, true);
	aboutUser.addField('🍳 Cooking', `${cooking_skillXP}XP | ${Utils.getSkillLevel('Cooking', cooking_skillXP)} Level`, true);
	aboutUser.addField('🔥 Smithing', `${smithing_skillXP}XP | ${Utils.getSkillLevel('Smithing', smithing_skillXP)} Level`, true);
	aboutUser.addField('⚒ Crafting', `${crafting_skillXP}XP | ${Utils.getSkillLevel('Crafting', crafting_skillXP)} Level`, true);
	aboutUser.addField('⚔ Attack', `${attack_skillXP}XP | ${Utils.getSkillLevel('Attack', crafting_skillXP)} Level`, true);
	aboutUser.addField('♥ Hitpoints', `${hitpoint_skillXP}XP | ${Utils.getSkillLevel('Hitpoints', crafting_skillXP)} Level`, true);
	aboutUser.addField('🏠 House', house);

	return message.channel.send(aboutUser);
};