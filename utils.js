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

exports.random = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};