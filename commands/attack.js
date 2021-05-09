const Discord = require('discord.js');
const { getSkillLevel, getMaxHP, random } = require('../utils/utils');
const { Op, literal } = require('sequelize');

exports.name = 'attack';
exports.description = 'Attacks enemy';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PetShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    const user = await Users.findOne({ where: { user_id: message.author.id } });
    const attackLevel = getSkillLevel('Attack', user.attack_skill);
    let enemy = undefined;

    if(attackLevel < 2) {
        enemy = await Enemies.findOne({
            where: { level: { [Op.lte]: 1 } },
            order: literal('random()'),
        });
    }

    let combat = '';
    let enemyHealth = enemy.health;
    let chance = 0;

    while(enemyHealth > 0) {
        chance = random(1, 100) + enemy.defense - attackLevel;
        if(chance > 90) {
            combat += `**You** tried to attack, but **${enemy.name}** dodged the attack\n`;
        }
        else {
            enemyHealth -= attackLevel;
            combat += `**You** attacked **${enemy.name}** and dealt ${attackLevel} damage\n`;
        }
        if(enemyHealth <= 0) {
            combat += `**${enemy.name}** died`;
            break;
        }

        chance = random(1, 100) + attackLevel;
        if(chance > 90) {
            combat += `**${enemy.name}** tried to attack **you** with \`${enemy.weapon}\`, but **you** dodged the attack\n`;
        }
        else {
            user.health -= enemy.attack;
            combat += `**${enemy.name}** attacked **you** with \`${enemy.weapon}\` and dealt ${enemy.attack} damage\n`;
        }
        if(user.health <= 0) {
            combat += '**You** died';
            break;
        }
    }
    message.channel.send(new Discord.MessageEmbed().setTitle('⚔ Attack ⚔').setDescription(combat));

    const attackXP = random(1, 4) * enemy.level;
    const hitpointXP = random(1, 3) * enemy.level;
    const lostMoney = Math.round(user.balance / 100 * 20);
    const winMoney = random(1, 10) * enemy.level;
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    if(user.health <= 0) {
        user.health = getMaxHP(getSkillLevel('Hitpoints', user.hitpoint_skill));
        Currency.add(message.author.id, -lostMoney);
        user.save();
        return message.channel.send(new Discord.MessageEmbed().setTitle('⚔ Attack ⚔').setDescription(`**You** died and lost ${lostMoney} :coin:`));
    }
    else {
        user.attack_skill += attackXP;
        user.hitpoint_skill += hitpointXP;
        Currency.add(message.author.id, winMoney);
        user.save();
        return message.channel.send(new Discord.MessageEmbed().setTitle('⚔ Attack ⚔').setDescription(`**You** killed **${enemy.name}** and got ${attackXP} attack XP and ${hitpointXP} hitpoints XP\n**${enemy.name}** droped ${winMoney} :coin:`));
    }
};