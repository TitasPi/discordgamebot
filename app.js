const config = require('./config');
const Discord = require('discord.js');

const DebugCommand = require('./commands/debug');
const BalanceCommand = require('./commands/balance');
const InventoryCommand = require('./commands/inventory');
const HousesCommand = require('./commands/houses');
const AboutCommand = require('./commands/about');
const TransferCommand = require('./commands/transfer');
const BuyCommand = require('./commands/buy');
const BuyHouseCommand = require('./commands/buyhouse');
const SellHouseCommand = require('./commands/sellhouse');
const SellCommand = require('./commands/sell');
const SellAllCommand = require('./commands/sellall');
const ShopCommand = require('./commands/shop');
const HouseShopCommand = require('./commands/houseshop');
const MoveToCommand = require('./commands/moveto');
const LeaderboardCommand = require('./commands/leaderboard');
const MineCommand = require('./commands/mine');
const ChopCommand = require('./commands/chop');
const FishCommand = require('./commands/fish');
const LootCommand = require('./commands/loot');
const SmeltCommand = require('./commands/smelt');
const CookCommand = require('./commands/cook');
const MiningCommand = require('./commands/mining');
const WoodCuttingCommand = require('./commands/woodcutting');
const SmithingCommand = require('./commands/smithing');
const CookingCommand = require('./commands/cooking');
const CraftCommand = require('./commands/craft');
const CraftingCommand = require('./commands/crafting');
const EatCommand = require('./commands/eat');
const AttackCommand = require('./commands/attack');
const HelpCommand = require('./commands/help');
const AboutBotCommand = require('./commands/aboutbot');

const { random } = require('./utils');
const Embeds = require('./embeds');
const Web = require('./web/app');
const Logger = require('./logger');
const package = require('./package.json');

const client = new Discord.Client();
const { Users, CurrencyShop, HouseShop, UserItems, Enemies } = require('./dbObjects');
const currency = new Discord.Collection();
const cooldowns = new Discord.Collection();

const PREFIX = config.prefix;
const TOKEN = config.token;
const VERSION = package.version;
const SHOP_RANDOMIZATION = false;
const WEB_ENABLED = false;


Reflect.defineProperty(currency, 'add', {
    /* eslint-disable-next-line func-name-matching */
    value: async function add(id, amount) {
        const user = currency.get(id);
        if (user) {
            user.balance += Number(amount);
            return user.save();
        }
        const newUser = await Users.create({ user_id: id, balance: amount });
        currency.set(id, newUser);
        return newUser;
    },
});

Reflect.defineProperty(currency, 'getBalance', {
    /* eslint-disable-next-line func-name-matching */
    value: function getBalance(id) {
        const user = currency.get(id);
        return user ? user.balance : 0;
    },
});

client.once('ready', async () => {
    const storedBalances = await Users.findAll();
    storedBalances.forEach(b => currency.set(b.user_id, b));
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
    currency.add(message.author.id, 0);

    // If message doesn't start with prefix - ignore it
    if (!message.content.startsWith(PREFIX)) return;
    // Get command and arguments from the message
    const input = message.content.slice(PREFIX.length).trim();
    if (!input.length) return;
    const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);

    // If command isn't in cooldowns - add it
    if (!cooldowns.has(command)) {
        cooldowns.set(command, new Discord.Collection());
    }

    // Get current time, and set default cooldown time to 3 seconds
    const now = Date.now();
    const timestamps = cooldowns.get(command);
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

    // Command execution
    if (command === 'balance' || command === 'bal') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            BalanceCommand(message, currency);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'inventory' || command === 'inv') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            InventoryCommand(Users, message);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'houses') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            HousesCommand(Users, message);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'info' || command === 'about') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            AboutCommand(Users, message, currency);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'transfer') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            TransferCommand(message, currency, commandArgs);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'buy') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            BuyCommand(message, currency, commandArgs, CurrencyShop, Users);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'buyhouse') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            BuyHouseCommand(message, currency, commandArgs, HouseShop, Users);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'sellhouse') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            SellHouseCommand(message, currency, commandArgs, HouseShop, Users);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'sell') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            SellCommand(message, currency, commandArgs, CurrencyShop, Users);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'sellall') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            SellAllCommand(message, currency, commandArgs, CurrencyShop, Users);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'shop') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            ShopCommand(message, CurrencyShop);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'houseshop') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            HouseShopCommand(message, HouseShop);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'moveto') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            MoveToCommand(message, HouseShop, commandArgs, Users);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'leaderboard') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            LeaderboardCommand(message, currency, client);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'mine') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            MineCommand(message, Users, CurrencyShop, timestamps, now, cooldownAmount);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'chop') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            ChopCommand(message, Users, CurrencyShop, timestamps, now, cooldownAmount);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'fish') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            FishCommand(message, Users, CurrencyShop, timestamps, now, cooldownAmount);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'loot') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            LootCommand(message, Users, CurrencyShop, timestamps, now, cooldownAmount);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'smelt') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            SmeltCommand(message, Users, CurrencyShop, commandArgs);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'cook') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            CookCommand(message, Users, CurrencyShop, commandArgs);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'mining') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            MiningCommand(message, Users);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'woodcutting') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            WoodCuttingCommand(message, Users);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'smithing') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            SmithingCommand(message, Users);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'cooking') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            CookingCommand(message, Users);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'craft') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            CraftCommand(message, Users, commandArgs, CurrencyShop);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'crafting') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            CraftingCommand(message, Users);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'gift') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            if(commandArgs === 'me lol') {
                currency.add(message.author.id, 100);
                return message.channel.send(`${message.author.tag}, you got 100 :coin:`);
            }
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'debug') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            DebugCommand(Users, message, currency);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'eat') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            EatCommand(message, Users, commandArgs, UserItems, CurrencyShop);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'attack') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            AttackCommand(message, Users, currency, timestamps, now, cooldownAmount, Enemies);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'help') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            HelpCommand(message, PREFIX);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
    else if (command === 'aboutbot') {
        try {
            Logger.cmd(`${message.author.tag} executed '${command}' command`);
            AboutBotCommand(message, PREFIX, VERSION);
        }
        catch (error) {
            Logger.error(`Caught error while executing '${command}' command: ${error}`);
            message.channel.send(Embeds.error());
        }
    }
});

client.login(TOKEN);
