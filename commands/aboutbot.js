const Embeds = require('../embeds');

module.exports = async function(message, prefix, version) {
    return message.channel.send(Embeds.aboutBot(prefix, version));
};