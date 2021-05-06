const config = require('./config');
const Discord = require('discord.js');
const fs = require('fs');

const { random } = require('./utils');
const Embeds = require('./embeds');
const Web = require('./web/app');
const Logger = require('./logger');
const package = require('./package.json');

const client = new Discord.Client();
const { Users, CurrencyShop, HouseShop, UserItems, Enemies } = require('./dbObjects');
const Currency = new Discord.Collection();
const Cooldowns = new Discord.Collection();
const Commands = new Discord.Collection();

const PREFIX = config.prefix;
const TOKEN = config.token;
const VERSION = package.version;
const SHOP_RANDOMIZATION = false;
const WEB_ENABLED = false;


Reflect.defineProperty(Currency, 'add', {
    /* eslint-disable-next-line func-name-matching */
    value: async function add(id, amount) {
        const user = Currency.get(id);
        if (user) {
            user.balance += Number(amount);
            return user.save();
        }
        const newUser = await Users.create({ user_id: id, balance: amount });
        Currency.set(id, newUser);
        return newUser;
    },
});

Reflect.defineProperty(Currency, 'getBalance', {
    /* eslint-disable-next-line func-name-matching */
    value: function getBalance(id) {
        const user = Currency.get(id);
        return user ? user.balance : 0;
    },
});

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    Commands.set(file.slice(0, -3), command);
}

client.once('ready', async () => {
    const allUsers = await Users.findAll();
    allUsers.forEach(b => Currency.set(b.user_id, b));
    if(WEB_ENABLED) Web.start();
    Logger.log(`Logged in as ${client.user.tag}!`);

    if(SHOP_RANDOMIZATION) {
        /**
         * Shop stock refresh funciton
         */
        // eslint-disable-next-line no-unused-vars
        const stockRefresh = setInterval(async function() {
            Logger.log('Restocking stock!');
            const currencyShopItems = await CurrencyShop.findAll();
            currencyShopItems.forEach(i => {
                if(i.buyable === 1 && i.category === 'Food') {
                    i.stock = random(5, 10);
                    i.save();
                }
            });
            const houseShopItems = await HouseShop.findAll();
            houseShopItems.forEach(i => {
                if(i.buyable == 1) {
                    i.stock = random(5, 10);
                    i.save();
                }
            });
        }, 1000 * 60 * 1);
        // Five minutes
    }
});

client.on('message', async message => {
    // If message came from bot - ignore it
    if (message.author.bot) return;
    // Making sure user has account
    Currency.add(message.author.id, 0);

    // If message doesn't start with prefix - ignore it
    if (!message.content.startsWith(PREFIX)) return;
    // Get command and arguments from the message
    const input = message.content.slice(PREFIX.length).trim();
    if (!input.length) return;
    const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);

    // If command isn't in cooldowns - add it
    if (!Cooldowns.has(command)) {
        Cooldowns.set(command, new Discord.Collection());
    }

    // Get current time, and set default cooldown time to 3 seconds
    const now = Date.now();
    const timestamps = Cooldowns.get(command);
    let cooldownAmount = (3) * 1000;

    // Change cooldown time depending on command
    switch (command) {
        case 'mine':
        case 'chop':
        case 'fish':
        case 'attack':
            cooldownAmount = (10) * 1000 * 60;
            break;
        case 'loot':
            cooldownAmount = (5) * 1000 * 60;
            break;
    }

    // If user has cooldown for command - cancel execution and inform user
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
            Logger.log(`${message.author.tag} is on a cooldown for '${command}' command`);
            return message.channel.send(Embeds.pleaseWait(message, timeLeft, time, command));
        }
    }
    // New command handler
    if(!Commands.has(command)) return;

    try {
        Logger.cmd(`${message.author.tag} executed '${command}' command`);
        Commands.get(command)(message, commandArgs, Users, Enemies, UserItems, Currency, HouseShop, CurrencyShop, PREFIX, VERSION, timestamps, now, cooldownAmount, client);
    }
    catch(error) {
        Logger.error(`Caught error while executing '${command}' command: ${error}`);
        message.channel.send(Embeds.error());
    }
    return;
});

try {
    Logger.log('Logging into Discord API');
    client.login(TOKEN);
}
catch (error) {
    Logger.error(`Caught error while logging into Discord API: ${error}`);
}
