const Discord = require('discord.js');
const Logger = require('../utils/logger');
const Embeds = require('../utils/embeds');

exports.name = 'houses';
exports.description = 'Shows your houses';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PetShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    try {
        const target = message.mentions.users.first() || message.author;
        const user = await Users.findOne({ where: { user_id: target.id } });
        const items = await user.getHouses();

        if (!items.length) return message.channel.send(new Discord.MessageEmbed().setTitle(`${target.tag} houses`).setDescription(`${target.tag} has no houses!`));

        const userInventory = new Discord.MessageEmbed().setTitle(`${target.tag} houses`);

        items.forEach(item => {
            if(item.item.buyable == 1) {
                userInventory.addField(`${item.item.name}`, `(Buy: ${item.item.buyPrice}:coin: | Sell: ${item.item.sellPrice}:coin:)`);
            }
            else {
                userInventory.addField(`${item.item.name}`, `${item.item.name} is not sellable/buyable`);
            }
        });

        return message.channel.send(userInventory);
    }
    catch (error) {
        Logger.error(`Caught error while executing '${this.name}' command: ${error}`);
        message.channel.send(Embeds.error());
    }
};