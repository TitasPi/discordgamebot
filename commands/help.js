const Embeds = require('../embeds');

module.exports = async function(message, prefix) {
    return message.channel.send(Embeds.help(prefix));
};