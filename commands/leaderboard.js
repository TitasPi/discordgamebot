const Embeds = require('../embeds');

exports.name = 'leaderboard';
exports.description = 'Shows leaderboard';
// eslint-disable-next-line no-unused-vars
exports.execute = async function(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client) {
    return message.channel.send(Embeds.leaderboard(
        Currency.sort((a, b) => b.balance - a.balance)
            .filter(user => client.users.cache.has(user.user_id))
            .first(10)
            .map((user, position) => `**${position + 1}. ${(client.users.cache.get(user.user_id).tag)}:** ${user.balance}:coin:`)
            .join('\n')),
    );
};