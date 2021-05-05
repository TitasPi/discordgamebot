module.exports = async function(message, currency, client) {
    return message.channel.send(
        currency.sort((a, b) => b.balance - a.balance)
            .filter(user => client.users.cache.has(user.user_id))
            .first(10)
            .map((user, position) => `(${position + 1}) ${(client.users.cache.get(user.user_id).tag)}: ${user.balance}:coin:`)
            .join('\n'),
        { code: true },
    );
};