const Discord = require('discord.js');
const { getItemName } = require('../utils/utils');
const Logger = require('../utils/logger');
const Embeds = require('../utils/embeds');

exports.name = 'inventory';
exports.description = 'Shows your inventory';
exports.aliases = 'inv';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PetShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    try {
        const target = message.mentions.users.first() || message.author;
        const user = await Users.findOne({ where: { user_id: target.id } });
        const items = await user.getItems();

        if (!items.length) return message.channel.send(new Discord.MessageEmbed().setTitle(`${target.tag}'s inventory`).setDescription(`${target.tag} has nothing!`));

        const userInventory = new Discord.MessageEmbed().setTitle(`${target.tag}'s inventory`);

        items.forEach(item => {
            userInventory.addField(`${item.amount}x ${getItemName(item.item)}`, `(Buy: ${item.item.buyPrice}:coin: | Sell: ${item.item.sellPrice}:coin:)`, true);
        });

        return message.channel.send(userInventory);
    }
    catch (error) {
        Logger.error(`Caught error while executing '${this.name}' command: ${error}`);
        message.channel.send(Embeds.error());
    }
};