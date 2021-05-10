const { Op } = require('sequelize');
const { getItemName } = require('../utils/utils');
const Embeds = require('../utils/embeds');
const Logger = require('../utils/logger');

exports.name = 'buy';
exports.description = 'Buys item from shop';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PetShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    try {
        let item = '';
        if(commandArgs === 'axe' || commandArgs === 'Axe') {
            item = await CurrencyShop.findOne({
                where: { name: { [Op.like]: 'Iron Axe' }, buyable: 1 },
                order: [ ['id', 'ASC'] ],
            });
        }
        else {
            item = await CurrencyShop.findOne({
                where: { name: { [Op.like]: `%${commandArgs}%` }, buyable: 1 },
                order: [ ['id', 'ASC'] ],
            });
        }
        if (!item) return message.channel.send(Embeds.message('🛒 Shop 🛒', 'That item doesn\'t exist.'));
        if (item.buyPrice > Currency.getBalance(message.author.id)) {
            return message.channel.send(Embeds.message('🛒 Shop 🛒', `You don't have enough currency, ${message.author}`));
        }
        if (item.stock == 0) {
            return message.channel.send(Embeds.message('🛒 Shop 🛒', `${getItemName(item)} is out of stock`));
        }
        item.stock -= 1;
        item.save();

        const user = await Users.findOne({ where: { user_id: message.author.id } });
        Currency.add(message.author.id, -item.buyPrice);
        await user.addItem(item);

        message.channel.send(Embeds.message('🛒 Shop 🛒', `You've bought 1x ${getItemName(item)}`));

    }
    catch (error) {
        Logger.error(`Caught error while executing '${this.name}' command: ${error}`);
        message.channel.send(Embeds.error());
    }
};