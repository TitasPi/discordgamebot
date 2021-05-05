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

const { random } = require('./utils');

const client = new Discord.Client();
const { Users, CurrencyShop, HouseShop, UserItems, Enemies } = require('./dbObjects');
const currency = new Discord.Collection();
const PREFIX = config.prefix;
const cooldowns = new Discord.Collection();
const shopRandomizasion = false;


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
    console.log(`Logged in as ${client.user.tag}!`);

    if(shopRandomizasion) {
        /**
         * Shop stock refresh funciton
         */
        // eslint-disable-next-line no-unused-vars
        const stockRefresh = setInterval(async function() {
            console.log('Restocking stock!');
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
    if (message.author.bot) return;
    currency.add(message.author.id, 0);

    if (!message.content.startsWith(PREFIX)) return;
    const input = message.content.slice(PREFIX.length).trim();
    if (!input.length) return;
    const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);

    if (!cooldowns.has(command)) {
        cooldowns.set(command, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command);
    let cooldownAmount = (3) * 1000;

    if(command === 'mine' || command === 'chop' || command === 'fish' || command === 'attack') {
        cooldownAmount = (10) * 1000 * 60;
    }
    if(command === 'loot') {
        cooldownAmount = (5) * 1000 * 60;
    }

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

            return message.channel.send(new Discord.MessageEmbed().setTitle('Please wait').setDescription(`${message.author}, please wait ${timeLeft.toFixed(1)}${time} before reusing the \`${command}\` command.`));
        }
    }


    if (command === 'balance' || command === 'bal') {
        BalanceCommand(message, currency);
    }
    else if (command === 'inventory' || command === 'inv') {
        InventoryCommand(Users, message);
    }
    else if (command === 'houses') {
        HousesCommand(Users, message);
    }
    else if (command === 'info' || command === 'about') {
        AboutCommand(Users, message, currency);
    }
    else if (command === 'transfer') {
        TransferCommand(message, currency, commandArgs);
    }
    else if (command === 'buy') {
        BuyCommand(message, currency, commandArgs, CurrencyShop, Users);
    }
    else if (command === 'buyhouse') {
        BuyHouseCommand(message, currency, commandArgs, HouseShop, Users);
    }
    else if (command === 'sellhouse') {
        SellHouseCommand(message, currency, commandArgs, HouseShop, Users);
    }
    else if (command === 'sell') {
        SellCommand(message, currency, commandArgs, CurrencyShop, Users);
    }
    else if (command === 'sellall') {
        SellAllCommand(message, currency, commandArgs, CurrencyShop, Users);
    }
    else if (command === 'shop') {
        ShopCommand(message, CurrencyShop);
    }
    else if (command === 'houseshop') {
        HouseShopCommand(message, HouseShop);
    }
    else if (command === 'moveto') {
        MoveToCommand(message, HouseShop, commandArgs, Users);
    }
    else if (command === 'leaderboard') {
        LeaderboardCommand(message, currency, client);
    }
    else if (command === 'mine') {
        MineCommand(message, Users, CurrencyShop, timestamps, now, cooldownAmount);
    }
    else if (command === 'chop') {
        ChopCommand(message, Users, CurrencyShop, timestamps, now, cooldownAmount);
    }
    else if (command === 'fish') {
        FishCommand(message, Users, CurrencyShop, timestamps, now, cooldownAmount);
    }
    else if (command === 'loot') {
        LootCommand(message, Users, CurrencyShop, timestamps, now, cooldownAmount);
    }
    else if (command === 'smelt') {
        SmeltCommand(message, Users, CurrencyShop, commandArgs);
    }
    else if (command === 'cook') {
        CookCommand(message, Users, CurrencyShop, commandArgs);
    }
    else if (command === 'mining') {
        MiningCommand(message, Users);
    }
    else if (command === 'woodcutting') {
        WoodCuttingCommand(message, Users);
    }
    else if (command === 'smithing') {
        SmithingCommand(message, Users);
    }
    else if (command === 'cooking') {
        CookingCommand(message, Users);
    }
    else if (command === 'craft') {
        CraftCommand(message, Users, commandArgs, CurrencyShop);
    }
    else if (command === 'crafting') {
        CraftingCommand(message, Users);
    }
    else if (command === 'gift') {
        if(commandArgs === 'me lol') {
            currency.add(message.author.id, 100);
            return message.channel.send(`${message.author.tag}, you got 100 :coin:`);
        }
    }
    else if (command === 'debug') {
        DebugCommand(Users, message, currency);
    }
    else if (command === 'eat') {
        EatCommand(message, Users, commandArgs, UserItems, CurrencyShop);
    }
    else if (command === 'attack') {
        AttackCommand(message, Users, currency, timestamps, now, cooldownAmount, Enemies);
    }
});

client.login(config.token);
