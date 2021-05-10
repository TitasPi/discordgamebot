const Discord = require('discord.js');
const { random, getItemName } = require('../utils/utils');
const { Op } = require('sequelize');
const Logger = require('../utils/logger');
const Embeds = require('../utils/embeds');

exports.name = 'cook';
exports.description = 'Cooks food';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PetShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    try {
        const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: `%${commandArgs}%` }, category: 'Fishing' } });
        if (!item) return message.channel.send(new Discord.MessageEmbed().setTitle('Cooking').setDescription('That item doesn\'t exist.'));
        if(item.name !== 'Fishing Rod') {
            const user = await Users.findOne({ where: { user_id: message.author.id } });
            const logItem = await user.getUserLogs();
            const woodItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: logItem } } });
            const userItem = await user.hasItem(woodItem);
            if(!userItem) {
                return message.channel.send(new Discord.MessageEmbed().setTitle('Cooking').setDescription(`You need to have \`Logs\` to cook \`${getItemName(item)}\``));
            }
            let fishItem;
            switch (item.name) {
                case 'Raw Cod':
                    fishItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: '🐟 Cooked Cod' } } });
                    break;
                case 'Raw Salmon':
                    fishItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: '🐟 Cooked Salmon' } } });
                    break;
                case 'Raw Carp':
                    fishItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: '🐟 Cooked Carp' } } });
                    break;
                case 'Raw Mackerel':
                    fishItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: '🐟 Cooked Mackerel' } } });
                    break;
                case 'Raw Herring':
                    fishItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: '🐟 Cooked Herring' } } });
                    break;
                case 'Raw Trout':
                    fishItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: '🐟 Cooked Trout' } } });
                    break;
                default:
                    break;
            }
            await user.removeItem(item);
            await user.removeItem(woodItem);
            await user.addItem(fishItem);
            const xp = random(1, 5);
            user.cooking_skill += xp;
            user.save();
            return message.channel.send(new Discord.MessageEmbed().setTitle('Cooking').setDescription(`You cooked 1x ${getItemName(item)} (used 1x ${getItemName(woodItem)}) and got 1x ${getItemName(fishItem)}. Gained ${xp}XP`));

        }
        else {
            return message.channel.send(new Discord.MessageEmbed().setTitle('Cooking').setDescription('I can\'t cook that'));
        }
    }
    catch (error) {
        Logger.error(`Caught error while executing '${this.name}' command: ${error}`);
        message.channel.send(Embeds.error());
    }
};