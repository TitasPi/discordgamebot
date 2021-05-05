const Embeds = require('../embeds');

module.exports = async function(message, currency) {
    const target = message.mentions.users.first() || message.author;
    return message.channel.send(Embeds.balance(target, currency));
};