// eslint-disable-next-line no-unused-vars
const { Client, User } = require('discord.js');
/**
 * Calculates and returns skill level
 * @param {String} skill Woodcutting, Mining, Fishing, Smithing, Cooking, Crafting, Attack, Hitpoints
 * @param {Number} xp Skill xp
 * @returns {Number} Skill level
 */
exports.getSkillLevel = function(skill, xp) {
    let level = 1;
    switch (skill) {
        case 'Woodcutting':
        case 'Mining':
        case 'Fishing':
        case 'Smithing':
        case 'Cooking':
        case 'Crafting':
        case 'Attack':
        case 'Hitpoints':
        // eslint-disable-next-line no-constant-condition
            while(true) {
                if(10 + level * 20 < xp) {
                    level++;
                }
                else {
                    return level;
                }
            }
        default:
            break;
    }
};

/**
 * Calculates and returns user max HP
 * @param {Number} level User level
 * @returns {Number} Max health
 */
exports.getMaxHP = function(level) {
    let health = 9;
    health += level;
    return health;
};

/**
 * Returns item's display name
 * @param {Item} item
 * @returns {String} Item's display name
 */
exports.getItemName = function(item) {
    switch (item.category) {
        case 'Mining':
            if(item.name.indexOf('Pickaxe') > -1) return `⛏ ${item.name}`;
            else return `🧱 ${item.name}`;
        case 'Woodcutting':
            if(item.name.indexOf('Axe') > -1) return `🪓 ${item.name}`;
            else return `🌳 ${item.name}`;
        case 'Fishing':
            if(item.name === 'Fishing Rod') {
                return `🎣 ${item.name}`;
            }
            else {
                return `🐟 ${item.name}`;
            }
        default:
            return item.name;
    }
};

/**
 * Returns random number
 * @param {Number} min minimum number
 * @param {Number} max maximum number
 * @returns {Number} Item's display name
 */
exports.random = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * Checks if user is VIP
 * @param {Client} client Discord client
 * @param {User} user User to be checked
 */
exports.checkVIP = async function(client, user) {
    const checkUserInServer = await client.guilds.fetch('547518989866237952').then(guild => guild.member(user.id));
    let userHasVIPRole = false;
    if(checkUserInServer) {
        userHasVIPRole = await checkUserInServer.roles.cache.has('547775028628815872');
    }
    return userHasVIPRole;
};