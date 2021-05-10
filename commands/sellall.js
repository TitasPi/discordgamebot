const Discord = require('discord.js');
const { Op } = require('sequelize');
const { getItemName } = require('../utils/utils');
const Logger = require('../utils/logger');
const Embeds = require('../utils/embeds');

exports.name = 'sellall';
exports.description = 'Sell all items of one type';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PetShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    try {
        let item = '';
        if(commandArgs === 'axe' || commandArgs === 'Axe') {
            item = await CurrencyShop.findOne({
                where: { name: { [Op.like]: 'Iron Axe' }, sellable: 1 },
                order: [ ['id', 'ASC'] ],
            });
        }
        else {
            item = await CurrencyShop.findOne({
                where: { name: { [Op.like]: `%${commandArgs}%` }, sellable: 1 },
                order: [ ['id', 'ASC'] ],
            });
        }
        if (!item) return message.channel.send(new Discord.MessageEmbed().setTitle('Shop').setDescription('That item doesn\'t exist.'));
        const user = await Users.findOne({ where: { user_id: message.author.id } });
        const userItem = await user.hasItem(item);
        if(!userItem) {
            return message.channel.send(new Discord.MessageEmbed().setTitle('Shop').setDescription('You do not have this item'));
        }

        const amount = await user.sellAllItems(item);
        if(item.name == 'Iron Pickaxe' || item.name == 'Iron Pickaxe' || item.category == 'Food') {
            item.stock += amount;
            item.save();
        }

        await Currency.add(message.author.id, item.sellPrice * amount);

        message.channel.send(new Discord.MessageEmbed().setTitle('Shop').setDescription(`You've sold ${amount}x **${getItemName(item)}** for ${item.sellPrice * amount} :coin:`));
    }
    catch (error) {
        Logger.error(`Caught error while executing '${this.name}' command: ${error}`);
        message.channel.send(Embeds.error());
    }
};