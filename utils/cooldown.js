const Embeds = require('./embeds');
const Logger = require('./logger');

exports.getTime = function(commandName) {
    // Change cooldown time depending on command
    switch (commandName) {
        case 'mine':
        case 'chop':
        case 'fish':
        case 'attack':
            return (10) * 1000 * 60;
        case 'loot':
            return (5) * 1000 * 60;
        default:
            return (30) * 1000;
    }
};

exports.check = function(timestamps, cooldownAmount, now, commandName, message) {
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            let timeLeft = (expirationTime - now) / 1000;
            let time = 's';
            if(timeLeft > 60) {
                timeLeft = timeLeft / 60;
                time = 'min';
            }
            if(timeLeft > 60) {
                timeLeft = timeLeft / 60;
                time = 'h';
            }
            Logger.log(`${message.author.tag} is on a cooldown for '${commandName}' command`);
            message.channel.send(Embeds.pleaseWait(message, timeLeft, time, commandName));
            return true;
        }
        else {
            return false;
        }
    }
};