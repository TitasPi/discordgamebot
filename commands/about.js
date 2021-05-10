const { getMaxHP, getSkillLevel, checkVIP } = require('../utils/utils');
const Embeds = require('../utils/embeds');
const Logger = require('../utils/logger');

exports.name = 'about';
exports.description = 'Shows info about you';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PetShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    try {
        const target = message.mentions.users.first() || message.author;
        const user = await Users.findOne({ where: { user_id: target.id } });
        const userHouses = await user.getHouses();
        const houses = userHouses.map(house => house.item.name).join(', ');

        const woodcutting_skillXP = user.woodcutting_skill || 0;
        const mining_skillXP = user.mining_skill || 0;
        const fishing_skillXP = user.fishing_skill || 0;
        const cooking_skillXP = user.cooking_skill || 0;
        const smithing_skillXP = user.smithing_skill || 0;
        const crafting_skillXP = user.crafting_skill || 0;
        const attack_skillXP = user.attack_skill || 0;
        const hitpoint_skillXP = user.hitpoint_skill || 0;

        const userData = {
            'tag': target.tag,
            'id': target.id,
            'vip': await checkVIP(client, target),
            'houses': houses || 'Homeless',
            'health': user.health || 10,
            'maxHealth': getMaxHP(getSkillLevel('Hitpoints', hitpoint_skillXP)),
            'woodcutting_skill': [woodcutting_skillXP, getSkillLevel('Woodcutting', woodcutting_skillXP)],
            'mining_skill': [mining_skillXP, getSkillLevel('Mining', mining_skillXP)],
            'fishing_skill': [fishing_skillXP, getSkillLevel('Fishing', fishing_skillXP)],
            'cooking_skill': [cooking_skillXP, getSkillLevel('Cooking', cooking_skillXP)],
            'smithing_skill': [smithing_skillXP, getSkillLevel('Smithing', smithing_skillXP)],
            'crafting_skill': [crafting_skillXP, getSkillLevel('Crafting', crafting_skillXP)],
            'attack_skill': [attack_skillXP, getSkillLevel('Attack', attack_skillXP)],
            'hitpoint_skill': [hitpoint_skillXP, getSkillLevel('Hitpoints', hitpoint_skillXP)],
        };

        return message.channel.send(Embeds.about(userData, Currency));
    }
    catch(error) {
        Logger.error(`Caught error while executing '${this.name}' command: ${error}`);
        message.channel.send(Embeds.error());
    }
};