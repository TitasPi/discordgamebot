const Embeds = require('../embeds');

module.exports = async function(message) {
    return message.channel.send(Embeds.gitHub());
};