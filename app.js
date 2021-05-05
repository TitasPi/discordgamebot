const config = require('./config');
const Discord = require('discord.js');

const client = new Discord.Client();
const { Users, CurrencyShop, HouseShop, UserItems, Enemies } = require('./dbObjects');
const { Op, literal } = require('sequelize');
const currency = new Discord.Collection();
const PREFIX = '.';
const cooldowns = new Discord.Collection();

function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Calculates and returns skill level
 * @param {String} skill Woodcutting, Mining, Fishing, Smithing, Cooking, Crafting, Attack, Hitpoints
 * @param {Number} xp Skill xp
 */
function getSkillLevel(skill, xp) {
	let level = 1;
	switch (skill) {
	case 'Woodcutting':
	case 'Mining':
	case 'Fishing':
	case 'Smithing':
	case 'Cooking':
	case 'Crafting':
	case 'Attack':
	case 'Hitpoints':
	// eslint-disable-next-line no-constant-condition
		while(true) {
			if(10 + level * 20 < xp) {
				level++;
			}
			else {
				return level;
			}
		}
	default:
		break;
	}
}

function getMaxHP(level) {
	let health = 9;
	// eslint-disable-next-line no-constant-condition
	health += level;

	return health;
}

function getItemName(item) {
	switch (item.category) {
	case 'Mining':
		if(item.name.indexOf('Pickaxe') > -1) return `⛏ ${item.name}`;
		else return `🧱 ${item.name}`;
	case 'Woodcutting':
		if(item.name.indexOf('Axe') > -1) return `🪓 ${item.name}`;
		else return `🌳 ${item.name}`;
	case 'Fishing':
		if(item.name === 'Fishing Rod') {
			return `🎣 ${item.name}`;
		}
		else {
			return `🐟 ${item.name}`;
		}
	default:
		return item.name;
	}
}

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
	// eslint-disable-next-line no-unused-vars
	// const stockRefresh = setInterval(async function() {
	// 	console.log('Restocking stock!');
	// 	const currencyShopItems = await CurrencyShop.findAll();
	// 	currencyShopItems.forEach(i => {
	// 		if(i.buyable === 1 && i.category === 'Food') {
	// 			i.stock = random(5, 10);
	// 			i.save();
	// 		}
	// 	});
	// 	const houseShopItems = await HouseShop.findAll();
	// 	houseShopItems.forEach(i => {
	// 		if(i.buyable == 1) {
	// 			i.stock = random(5, 10);
	// 			i.save();
	// 		}
	// 	});
	// }, 1000 * 60 * 1);
	// Five minutes
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
		const target = message.mentions.users.first() || message.author;
		return message.channel.send(new Discord.MessageEmbed().setTitle(`:coin: ${target.tag} Balance :coin:`).setDescription(`${target} has ${currency.getBalance(target.id)}:coin:`));
	}
	else if (command === 'inventory' || command === 'inv') {
		const target = message.mentions.users.first() || message.author;
		const user = await Users.findOne({ where: { user_id: target.id } });
		const items = await user.getItems();

		if (!items.length) return message.channel.send(new Discord.MessageEmbed().setTitle(`${target.tag} inventory`).setDescription(`${target.tag} has nothing!`));

		const userInventory = new Discord.MessageEmbed().setTitle(`${target.tag} inventory`);

		items.forEach(item => {
			userInventory.addField(`${item.amount}x ${getItemName(item.item)}`, `(Buy: ${item.item.buyPrice}:coin: | Sell: ${item.item.sellPrice}:coin:)`, true);
		});

		return message.channel.send(userInventory);
	}
	else if (command === 'houses') {
		const target = message.mentions.users.first() || message.author;
		const user = await Users.findOne({ where: { user_id: target.id } });
		const items = await user.getHouses();

		if (!items.length) return message.channel.send(new Discord.MessageEmbed().setTitle(`${target.tag} houses`).setDescription(`${target.tag} has no houses!`));

		const userInventory = new Discord.MessageEmbed().setTitle(`${target.tag} houses`);

		items.forEach(item => {
			if(item.item.buyable == 1) {
				userInventory.addField(`${item.item.name}`, `(Buy: ${item.item.buyPrice}:coin: | Sell: ${item.item.sellPrice}:coin:)`);
			}
			else {
				userInventory.addField(`${item.item.name}`, `${item.item.name} is not sellable/buyable`);
			}
		});

		return message.channel.send(userInventory);
	}
	else if (command === 'info' || command === 'about') {
		const target = message.mentions.users.first() || message.author;
		const user = await Users.findOne({ where: { user_id: target.id } });
		let house = '';
		let health = 10;
		let woodcutting_skillXP = 0;
		let mining_skillXP = 0;
		let fishing_skillXP = 0;
		let cooking_skillXP = 0;
		let smithing_skillXP = 0;
		let crafting_skillXP = 0;
		let attack_skillXP = 0;
		let hitpoint_skillXP = 0;
		if(!user) {
			house = 'Homeless';
		}
		else {
			house = user.house;
			health = user.health;
			woodcutting_skillXP = user.woodcutting_skill;
			mining_skillXP = user.mining_skill;
			fishing_skillXP = user.fishing_skill;
			cooking_skillXP = user.cooking_skill;
			smithing_skillXP = user.smithing_skill;
			crafting_skillXP = user.crafting_skill;
			attack_skillXP = user.attack_skill;
			hitpoint_skillXP = user.hitpoint_skill;
		}

		const aboutUser = new Discord.MessageEmbed().setTitle(`About ${target.tag}`);
		aboutUser.addField(`Information about ${target.tag}`, '\u200b');
		aboutUser.addField(':coin: Coins', `${currency.getBalance(target.id)} :coin:`, true);
		aboutUser.addField('❤ Health', `${health}/${getMaxHP(getSkillLevel('Hitpoints', hitpoint_skillXP))}`, true);
		aboutUser.addField('Skils', '\u200b');
		aboutUser.addField('⛏ Mining', `${mining_skillXP}XP | ${getSkillLevel('Mining', mining_skillXP)} Level`, true);
		aboutUser.addField('🪓 Woodcutting', `${woodcutting_skillXP}XP | ${getSkillLevel('Woodcutting', woodcutting_skillXP)} Level`, true);
		aboutUser.addField('🎣 Fishing', `${fishing_skillXP}XP | ${getSkillLevel('Fishing', fishing_skillXP)} Level`, true);
		aboutUser.addField('🍳 Cooking', `${cooking_skillXP}XP | ${getSkillLevel('Cooking', cooking_skillXP)} Level`, true);
		aboutUser.addField('🔥 Smithing', `${smithing_skillXP}XP | ${getSkillLevel('Smithing', smithing_skillXP)} Level`, true);
		aboutUser.addField('⚒ Crafting', `${crafting_skillXP}XP | ${getSkillLevel('Crafting', crafting_skillXP)} Level`, true);
		aboutUser.addField('⚔ Attack', `${attack_skillXP}XP | ${getSkillLevel('Attack', crafting_skillXP)} Level`, true);
		aboutUser.addField('♥ Hitpoints', `${hitpoint_skillXP}XP | ${getSkillLevel('Hitpoints', crafting_skillXP)} Level`, true);
		aboutUser.addField('🏠 House', house);

		return message.channel.send(aboutUser);
	}
	else if (command === 'transfer') {
		const currentAmount = currency.getBalance(message.author.id);
		const transferAmount = commandArgs.split(/ +/).find(arg => !/<@!?\d+>/.test(arg));
		const transferTarget = message.mentions.users.first();

		if (!transferAmount || isNaN(transferAmount)) return message.channel.send(new Discord.MessageEmbed().setTitle('Transfer').setDescription(`Sorry ${message.author}, that's an invalid amount`));
		if (transferAmount > currentAmount) return message.channel.send(new Discord.MessageEmbed().setTitle('Transfer').setDescription(`Sorry ${message.author} you don't have that much.`));
		if (transferAmount <= 0) return message.channel.send(new Discord.MessageEmbed().setTitle('Transfer').setDescription(`Please enter an amount greater than zero, ${message.author}`));
		if (transferTarget == undefined) return message.channel.send(new Discord.MessageEmbed().setTitle('Transfer').setDescription(`Sorry ${message.author}, I can't find the user you mentioned`));

		currency.add(message.author.id, -transferAmount);
		currency.add(transferTarget.id, transferAmount);

		return message.channel.send(new Discord.MessageEmbed().setTitle('Transfer').setDescription(`Successfully transferred ${transferAmount}:coin: to ${transferTarget}. Your current balance is ${currency.getBalance(message.author.id)}:coin:`));
	}
	else if (command === 'buy') {
		let item = '';
		if(commandArgs === 'axe' || commandArgs === 'Axe') {
			item = await CurrencyShop.findOne({
				where: { name: { [Op.like]: 'Iron Axe' }, buyable: 1 },
				order: [ ['id', 'ASC'] ],
			});
		}
		else {
			item = await CurrencyShop.findOne({
				where: { name: { [Op.like]: `%${commandArgs}%` }, buyable: 1 },
				order: [ ['id', 'ASC'] ],
			});
		}
		if (!item) return message.channel.send(new Discord.MessageEmbed().setTitle('Shop').setDescription('That item doesn\'t exist.'));
		if (item.buyPrice > currency.getBalance(message.author.id)) {
			return message.channel.send(new Discord.MessageEmbed().setTitle('Shop').setDescription(`You don't have enough currency, ${message.author}`));
		}
		if (item.stock == 0) {
			return message.channel.send(new Discord.MessageEmbed().setTitle('Shop').setDescription(`${getItemName(item)} is out of stock`));
		}
		item.stock -= 1;
		item.save();

		const user = await Users.findOne({ where: { user_id: message.author.id } });
		currency.add(message.author.id, -item.buyPrice);
		await user.addItem(item);

		message.channel.send(new Discord.MessageEmbed().setTitle('Shop').setDescription(`You've bought 1x ${getItemName(item)}`));
	}
	else if (command === 'buyhouse') {
		const item = await HouseShop.findOne({ where: { name: { [Op.like]: `%${commandArgs}%` }, buyable: 1 } });
		if (!item) return message.channel.send(new Discord.MessageEmbed().setTitle('🏠 Houses 🏠').setDescription('This house doesn\'t exist.'));
		if (item.buyPrice > currency.getBalance(message.author.id)) {
			return message.channel.send(new Discord.MessageEmbed().setTitle('🏠 Houses 🏠').setDescription(`You don't have enough currency, ${message.author}`));
		}

		const user = await Users.findOne({ where: { user_id: message.author.id } });
		const userHouse = await user.hasHouse(item);
		if (userHouse) {
			return message.channel.send(new Discord.MessageEmbed().setTitle('🏠 Houses 🏠').setDescription(`You already own this house, ${message.author}`));
		}
		currency.add(message.author.id, -item.buyPrice);
		await user.addHouse(item);

		message.channel.send(new Discord.MessageEmbed().setTitle('🏠 Houses 🏠').setDescription(`You've bought **${item.name}** for ${item.buyPrice} :coin:`));
	}
	else if (command === 'sellhouse') {
		const item = await HouseShop.findOne({ where: { name: { [Op.like]: `%${commandArgs}%` }, sellable: 1 } });
		if (!item) return message.channel.send(new Discord.MessageEmbed().setTitle('🏠 Houses 🏠').setDescription('This house doesn\'t exist.'));
		const user = await Users.findOne({ where: { user_id: message.author.id } });
		const userHouse = await user.hasHouse(item);
		if (!userHouse) {
			return message.channel.send(new Discord.MessageEmbed().setTitle('🏠 Houses 🏠').setDescription(`You do not own this house, ${message.author}`));
		}
		if(user.house === item.name) {
			user.house = 'Homeless';
			user.save();
		}
		currency.add(message.author.id, item.sellPrice);
		await user.removeHouse(item);

		message.channel.send(new Discord.MessageEmbed().setTitle('🏠 Houses 🏠').setDescription(`You've sold **${item.name}** for ${item.sellPrice} :coin:`));
	}
	else if (command === 'sell') {
		let item = '';
		if(commandArgs === 'axe' || commandArgs === 'Axe') {
			item = await CurrencyShop.findOne({
				where: { name: { [Op.like]: 'Iron Axe' }, sellable: 1 },
				order: [ ['id', 'ASC'] ],
			});
		}
		else {
			item = await CurrencyShop.findOne({
				where: { name: { [Op.like]: `%${commandArgs}%` }, sellable: 1 },
				order: [ ['id', 'ASC'] ],
			});
		}
		if (!item) return message.channel.send(new Discord.MessageEmbed().setTitle('Shop').setDescription('That item doesn\'t exist.'));
		const user = await Users.findOne({ where: { user_id: message.author.id } });
		const userItem = await user.hasItem(item);
		if(!userItem) {
			return message.channel.send(new Discord.MessageEmbed().setTitle('Shop').setDescription('You do not have this item'));
		}
		if(item.name == 'Iron Pickaxe' || item.name == 'Iron Pickaxe' || item.category == 'Food' || item.category == 'Fishing') {
			item.stock += 1;
			item.save();
		}

		await user.sellItem(item);
		await currency.add(message.author.id, item.sellPrice);

		message.channel.send(new Discord.MessageEmbed().setTitle('Shop').setDescription(`You've sold 1x **${getItemName(item)}** for ${item.sellPrice} :coin:`));
	}
	else if (command === 'sellall') {
		let item = '';
		if(commandArgs === 'axe' || commandArgs === 'Axe') {
			item = await CurrencyShop.findOne({
				where: { name: { [Op.like]: 'Iron Axe' }, sellable: 1 },
				order: [ ['id', 'ASC'] ],
			});
		}
		else {
			item = await CurrencyShop.findOne({
				where: { name: { [Op.like]: `%${commandArgs}%` }, sellable: 1 },
				order: [ ['id', 'ASC'] ],
			});
		}
		if (!item) return message.channel.send(new Discord.MessageEmbed().setTitle('Shop').setDescription('That item doesn\'t exist.'));
		const user = await Users.findOne({ where: { user_id: message.author.id } });
		const userItem = await user.hasItem(item);
		if(!userItem) {
			return message.channel.send(new Discord.MessageEmbed().setTitle('Shop').setDescription('You do not have this item'));
		}

		const amount = await user.sellAllItems(item);
		if(item.name == 'Iron Pickaxe' || item.name == 'Iron Pickaxe' || item.category == 'Food') {
			item.stock += amount;
			item.save();
		}

		await currency.add(message.author.id, item.sellPrice * amount);

		message.channel.send(new Discord.MessageEmbed().setTitle('Shop').setDescription(`You've sold ${amount}x **${getItemName(item)}** for ${item.sellPrice * amount} :coin:`));
	}
	else if (command === 'shop') {
		const items = await CurrencyShop.findAll({
			order: [
				['id', 'ASC'],
			],
		});
		// return message.channel.send(items.map(i => `${i.name}: ${i.buyPrice}💰`).join('\n'), { code: true });
		let shopItems = '';
		items.forEach(i => {
			if(i.buyable == 1) {
				if(i.durability > 0) {
					shopItems += `**${getItemName(i)}**: ${i.buyPrice} :coin: (${i.stock} left) (Durability: ${i.durability} uses)\n`;
				}
				else {
					shopItems += `**${getItemName(i)}**: ${i.buyPrice} :coin: (${i.stock} left)\n`;
				}
			}
		});

		return message.channel.send(new Discord.MessageEmbed().setTitle('Shop').setDescription(shopItems));
	}
	else if (command === 'houseshop') {
		const items = await HouseShop.findAll();
		// return message.channel.send(items.map(i => `${i.name}: ${i.buyPrice}💰`).join('\n'), { code: true });
		let shopItems = '';
		items.forEach(i => {
			if(i.buyable == 1) {
				shopItems += `${i.name}: (Buy: ${i.buyPrice} :coin: | Sell: ${i.sellPrice} :coin:) (${i.stock} left)\n`;
			}
			else {
				shopItems += `${i.name}\n`;
			}
		});

		return message.channel.send(new Discord.MessageEmbed().setTitle('Shop').setDescription(shopItems));
	}
	else if (command === 'moveto') {
		const house = await HouseShop.findOne({ where: { name: { [Op.like]: `%${commandArgs}%` } } });
		if(!house) return message.channel.send(new Discord.MessageEmbed().setTitle('🏠 Houses 🏠').setDescription('That house doesn\'t exist.'));
		const user = await Users.findOne({ where: { user_id: message.author.id } });
		const userHouse = await user.hasHouse(house);
		if(!userHouse) {
			return message.channel.send(new Discord.MessageEmbed().setTitle('🏠 Houses 🏠').setDescription('You do not own this house'));
		}

		user.house = house.name;
		user.save();

		message.channel.send(new Discord.MessageEmbed().setTitle('🏠 Houses 🏠').setDescription(`You moved to ${house.name}`));
	}
	else if (command === 'leaderboard') {
		return message.channel.send(
			currency.sort((a, b) => b.balance - a.balance)
				.filter(user => client.users.cache.has(user.user_id))
				.first(10)
				.map((user, position) => `(${position + 1}) ${(client.users.cache.get(user.user_id).tag)}: ${user.balance}:coin:`)
				.join('\n'),
			{ code: true },
		);
	}
	else if (command === 'mine') {
		const user = await Users.findOne({ where: { user_id: message.author.id } });
		const pickaxeItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: 'Iron Pickaxe' } } });
		const userPickaxe = await user.hasItem(pickaxeItem);
		if(!userPickaxe) {
			message.channel.send(new Discord.MessageEmbed().setTitle('⛏ Mining ⛏').setDescription(`${message.author}, you need \`⛏ Pickaxe\` to mine!`));
			return;
		}
		let minedItem = random(1, 4);
		if(getSkillLevel('Mining', user.mining_skill) < 2) {
			minedItem = random(1, 2);
		}
		else if(getSkillLevel('Mining', user.mining_skill) < 3) {
			minedItem = random(1, 3);
		}
		else if(getSkillLevel('Mining', user.mining_skill) < 4) {
			minedItem = random(1, 4);
		}
		const minedItemQuantity = random(1, 3);
		const minedXP = minedItemQuantity * random(1, 2);
		switch (minedItem) {
		case 1:
			minedItem = 'Coal';
			minedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: minedItem } } });
			break;
		case 2:
			minedItem = 'Iron Ore';
			minedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: minedItem } } });
			break;
		case 3:
			minedItem = 'Copper Ore';
			minedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: minedItem } } });
			break;
		case 4:
			minedItem = 'Gold Ore';
			minedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: minedItem } } });
			break;
		default:
			break;
		}
		await user.addItem(minedItem, minedItemQuantity);
		user.mining_skill += minedXP;
		user.save();
		let userPickaxeItem = await user.getItem(pickaxeItem);
		userPickaxeItem.durability -= 1;
		userPickaxeItem.save();
		if(userPickaxeItem.durability <= 0) {
			message.channel.send(new Discord.MessageEmbed().setTitle('⛏ Mining ⛏').setDescription(`${getItemName(pickaxeItem)} broke.`));
			await user.removeItem(pickaxeItem);
			const hasPickaxe = await user.hasItem(pickaxeItem);
			if(hasPickaxe) {
				userPickaxeItem = await user.getItem(pickaxeItem);
				userPickaxeItem.durability = pickaxeItem.durability;
				userPickaxeItem.save();
			}
		}
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
		return message.channel.send(new Discord.MessageEmbed().setTitle('⛏ Mining ⛏').setDescription(`${message.author}, you have mined ${minedItemQuantity}x ${getItemName(minedItem)} and gained ${minedXP}XP`));
	}
	else if (command === 'chop') {
		const user = await Users.findOne({ where: { user_id: message.author.id } });
		const axeItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: 'Iron Axe' } } });
		const userAxe = await user.hasItem(axeItem);
		if(!userAxe) {
			message.channel.send(new Discord.MessageEmbed().setTitle('🪓 Woodcutting 🪓').setDescription(`${message.author}, you need \`🪓 Axe\` to chop down wood!`));
			return;
		}
		let choppedItem = random(1, 4);
		if(getSkillLevel('Woodcutting', user.woodcutting_skill) < 2) {
			choppedItem = random(1, 1);
		}
		else if(getSkillLevel('Woodcutting', user.woodcutting_skill) < 3) {
			choppedItem = random(1, 2);
		}
		else if(getSkillLevel('Woodcutting', user.woodcutting_skill) < 4) {
			choppedItem = random(1, 4);
		}
		const choppedItemQuantity = random(1, 3);
		const choppedXP = choppedItemQuantity * random(1, 2);
		switch (choppedItem) {
		case 1:
			choppedItem = 'Oak Log';
			choppedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: choppedItem } } });
			break;
		case 2:
			choppedItem = 'Birch Log';
			choppedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: choppedItem } } });
			break;
		case 3:
			choppedItem = 'Willow Log';
			choppedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: choppedItem } } });
			break;
		case 4:
			choppedItem = 'Maple Log';
			choppedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: choppedItem } } });
			break;
		default:
			break;
		}
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
		await user.addItem(choppedItem, choppedItemQuantity);
		user.woodcutting_skill += choppedXP;
		user.save();
		let userAxeItem = await user.getItem(axeItem);
		userAxeItem.durability -= 1;
		userAxeItem.save();
		if(userAxeItem.durability <= 0) {
			message.channel.send(new Discord.MessageEmbed().setTitle('🪓 Woodcutting 🪓').setDescription(`${getItemName(axeItem)} broke.`));
			await user.removeItem(axeItem);
			const hasAxe = await user.hasItem(axeItem);
			if(hasAxe) {
				userAxeItem = await user.getItem(axeItem);
				userAxeItem.durability = axeItem.durability;
				userAxeItem.save();
			}
		}
		return message.channel.send(new Discord.MessageEmbed().setTitle('🪓 Woodcutting 🪓').setDescription(`You have chopped ${choppedItemQuantity}x ${getItemName(choppedItem)} and gained ${choppedXP}XP`));
	}
	else if (command === 'fish') {
		const user = await Users.findOne({ where: { user_id: message.author.id } });
		const fishingRodItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: 'Fishing Rod' } } });
		const userFishingRod = await user.hasItem(fishingRodItem);
		if(!userFishingRod) {
			message.channel.send(new Discord.MessageEmbed().setTitle('🎣 Fishing 🎣').setDescription(`${message.author}, you need **🎣 Fishing Rod** to mine!`));
			return;
		}
		let fishedItem = random(1, 2);
		if(getSkillLevel('Fishing', user.fishing_skill) < 2) {
			fishedItem = 1;
		}
		else if(getSkillLevel('Fishing', user.fishing_skill) < 3) {
			fishedItem = random(1, 2);
		}
		else if(getSkillLevel('Fishing', user.fishing_skill) < 5) {
			fishedItem = random(1, 3);
		}
		else if(getSkillLevel('Fishing', user.fishing_skill) < 10) {
			fishedItem = random(1, 4);
		}
		else if(getSkillLevel('Fishing', user.fishing_skill) < 15) {
			fishedItem = random(1, 5);
		}
		if(random(1, 100) < 10) {
			fishedItem = 0;
		}
		const fishedItemQuantity = random(1, 3);
		const fishedXP = fishedItemQuantity * random(1, 2);
		switch (fishedItem) {
		case 0:
			fishedItem = '👠 Shoe';
			fishedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: fishedItem } } });
			user.addItem(fishedItem);
			return message.channel.send(new Discord.MessageEmbed().setTitle('🎣 Fishing 🎣').setDescription(`You have caught **${fishedItem.name}**`));
		case 1:
			fishedItem = 'Raw Cod';
			fishedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: fishedItem } } });
			break;
		case 2:
			fishedItem = 'Raw Salmon';
			fishedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: fishedItem } } });
			break;
		case 3:
			fishedItem = 'Raw Carp';
			fishedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: fishedItem } } });
			break;
		case 4:
			fishedItem = 'Raw Mackerel';
			fishedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: fishedItem } } });
			break;
		case 5:
			fishedItem = 'Raw Herring';
			fishedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: fishedItem } } });
			break;
		case 6:
			fishedItem = 'Raw Trout';
			fishedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: fishedItem } } });
			break;
		default:
			break;
		}
		await user.addItem(fishedItem, fishedItemQuantity);
		user.fishing_skill += fishedXP;
		user.save();
		let userFishingRodItem = await user.getItem(fishingRodItem);
		userFishingRodItem.durability -= 1;
		userFishingRodItem.save();
		if(userFishingRodItem.durability <= 0) {
			message.channel.send(new Discord.MessageEmbed().setTitle('🎣 Fishing 🎣').setDescription(`**${getItemName(fishingRodItem)}** broke.`));
			await user.removeItem(fishingRodItem);
			const hasAxe = await user.hasItem(fishingRodItem);
			if(hasAxe) {
				userFishingRodItem = await user.getItem(fishingRodItem);
				userFishingRodItem.durability = fishingRodItem.durability;
				userFishingRodItem.save();
			}
		}
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
		return message.channel.send(new Discord.MessageEmbed().setTitle('🎣 Fishing 🎣').setDescription(`You have caught ${fishedItemQuantity}x ${getItemName(fishedItem)} and gained ${fishedXP}XP`));
	}
	else if (command === 'loot') {
		const user = await Users.findOne({ where: { user_id: message.author.id } });
		if(user.action != 'Idle') {
			return message.channel.send(`You are currently \`${user.action}\``);
		}
		let lootedItem = random(1, 100);
		let lootedItemQuantity = -1;
		if(lootedItem < 10) {
			lootedItem = '';
		}
		else if(lootedItem < 35) {
			lootedItem = '📰 Newspaper';
			lootedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: lootedItem } } });
			lootedItemQuantity = random(1, 3);
		}
		else if(lootedItem < 50) {
			lootedItem = '🏀 Basketball ball';
			lootedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: lootedItem } } });
			lootedItemQuantity = 1;
		}
		else if(lootedItem < 60) {
			lootedItem = '👠 Shoe';
			lootedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: lootedItem } } });
			lootedItemQuantity = random(1, 2);
		}
		else if(lootedItem < 70) {
			lootedItem = '☂ Umbrella';
			lootedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: lootedItem } } });
			lootedItemQuantity = 1;
		}
		else if(lootedItem < 90) {
			lootedItem = ':thread: String';
			lootedItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: lootedItem } } });
			lootedItemQuantity = 1;
		}
		else {
			lootedItem = '🦨';
		}
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
		if(lootedItemQuantity < 0 && lootedItem === '🦨') {
			return message.channel.send(new Discord.MessageEmbed()
				.setTitle('Loot')
				.setDescription(`You have been skunked ${lootedItem} while looting`));
		}
		if(lootedItemQuantity < 0 && lootedItem === '') {
			return message.channel.send(new Discord.MessageEmbed()
				.setTitle('Loot')
				.setDescription('You did not find anything'));
		}
		user.addItem(lootedItem, lootedItemQuantity);
		const randomMessages = [
			`While walking down the road, you found **${lootedItemQuantity}x ${lootedItem.name}**, ${message.author}`,
			`Kid walked up to you and gave you **${lootedItemQuantity}x ${lootedItem.name}**, ${message.author}`,
			`You found **${lootedItemQuantity}x ${lootedItem.name}**, ${message.author}`,
			`While waiting for a bus, you found **${lootedItemQuantity}x ${lootedItem.name}**, ${message.author}`,
			`Some person gave you away **${lootedItemQuantity}x ${lootedItem.name}**, ${message.author}`,
		];
		// message.channel.send(new Discord.MessageEmbed()
		// 	.setTitle('Loot')
		// 	.setDescription(`${message.author} started searching for items 🔍`));
		// user.action = 'Searching...';
		// user.save();
		// return setTimeout(function() {
		// 	message.channel.send(new Discord.MessageEmbed()
		// 		.setTitle('Loot')
		// 		.setDescription(randomMessages[random(0, randomMessages.length - 1)]));
		// 	user.action = 'Idle';
		// 	user.save();
		// }, 5000);
		message.channel.send(new Discord.MessageEmbed()
			.setTitle('Loot')
			.setDescription(randomMessages[random(0, randomMessages.length - 1)]));
	}
	else if (command === 'smelt') {
		const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: `%${commandArgs}%` } } });
		if (!item) return message.channel.send(new Discord.MessageEmbed().setTitle('Smelting').setDescription('That item doesn\'t exist.'));
		if(item.name === 'Iron Ore' || item.name === 'Copper Ore' || item.name === 'Gold Ore') {
			const coalItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: 'Coal' } } });
			const user = await Users.findOne({ where: { user_id: message.author.id } });
			const userItem = await user.hasItem(coalItem);
			if(!userItem) {
				return message.channel.send(new Discord.MessageEmbed().setTitle('Smelting').setDescription(`You need to have \`${getItemName(coalItem)}\` to smelt \`${getItemName(item)}\``));
			}
			let ingotItem;
			switch (item.name) {
			case 'Iron Ore':
				ingotItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: 'Iron Ingot' } } });
				break;
			case 'Copper Ore':
				ingotItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: 'Copper Ingot' } } });
				break;
			case 'Gold Ore':
				ingotItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: 'Gold Ingot' } } });
				break;
			default:
				break;
			}
			await user.removeItem(item);
			await user.removeItem(coalItem);
			await user.addItem(ingotItem);
			const xp = random(1, 5);
			user.smithing_skill += xp;
			user.save();
			return message.channel.send(new Discord.MessageEmbed().setTitle('Smelting').setDescription(`You smelted 1x ${getItemName(item)} (used 1x ${getItemName(coalItem)}) and got 1x ${getItemName(ingotItem)}. Gained ${xp}XP`));

		}
		else {
			return message.channel.send(new Discord.MessageEmbed().setTitle('Smelting').setDescription('I can\'t smelt that'));
		}
	}
	else if (command === 'cook') {
		const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: `%${commandArgs}%` }, category: 'Fishing' } });
		if (!item) return message.channel.send(new Discord.MessageEmbed().setTitle('Cooking').setDescription('That item doesn\'t exist.'));
		if(item.name !== 'Fishing Rod') {
			const user = await Users.findOne({ where: { user_id: message.author.id } });
			const logItem = await user.getUserLogs();
			const woodItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: logItem } } });
			const userItem = await user.hasItem(woodItem);
			if(!userItem) {
				return message.channel.send(new Discord.MessageEmbed().setTitle('Cooking').setDescription(`You need to have \`Logs\` to cook \`${getItemName(item)}\``));
			}
			let fishItem;
			switch (item.name) {
			case 'Raw Cod':
				fishItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: '🐟 Cooked Cod' } } });
				break;
			case 'Raw Salmon':
				fishItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: '🐟 Cooked Salmon' } } });
				break;
			case 'Raw Carp':
				fishItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: '🐟 Cooked Carp' } } });
				break;
			case 'Raw Mackerel':
				fishItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: '🐟 Cooked Mackerel' } } });
				break;
			case 'Raw Herring':
				fishItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: '🐟 Cooked Herring' } } });
				break;
			case 'Raw Trout':
				fishItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: '🐟 Cooked Trout' } } });
				break;
			default:
				break;
			}
			await user.removeItem(item);
			await user.removeItem(woodItem);
			await user.addItem(fishItem);
			const xp = random(1, 5);
			user.cooking_skill += xp;
			user.save();
			return message.channel.send(new Discord.MessageEmbed().setTitle('Cooking').setDescription(`You cooked 1x ${getItemName(item)} (used 1x ${getItemName(woodItem)}) and got 1x ${getItemName(fishItem)}. Gained ${xp}XP`));

		}
		else {
			return message.channel.send(new Discord.MessageEmbed().setTitle('Cooking').setDescription('I can\'t cook that'));
		}
	}
	else if (command === 'mining') {
		const user = await Users.findOne({ where: { user_id: message.author.id } });
		let level = 1;
		if(!user) {
			level = 1;
		}
		else {
			level = getSkillLevel('Mining', user.mining_skill);
		}
		message.channel.send(new Discord.MessageEmbed()
			.setTitle('About mining')
			.setDescription('Gain xp while mining ores.')
			.addField('1 Level', 'Ability to mine coal and iron ore')
			.addField('2 Level', 'Ability to mine copper')
			.addField('3 Level', 'Ability to mine gold'));
		return message.channel.send(new Discord.MessageEmbed()
			.setTitle('Mining')
			.setDescription(`${message.author}, your level is ${level}`));
	}
	else if (command === 'woodcutting') {
		const user = await Users.findOne({ where: { user_id: message.author.id } });
		let level = 1;
		if(!user) {
			level = 1;
		}
		else {
			level = getSkillLevel('Woodcutting', user.woodcutting_skill);
		}
		message.channel.send(new Discord.MessageEmbed()
			.setTitle('About woodcutting')
			.setDescription('Gain xp while chopping wood.')
			.addField('1 Level', 'Ability to chop oak logs')
			.addField('2 Level', 'Ability to chop birch logs')
			.addField('3 Level', 'Ability to chop willow and maple logs'));
		return message.channel.send(new Discord.MessageEmbed()
			.setTitle('Woodcutting')
			.setDescription(`${message.author}, your level is ${level}`));
	}
	else if (command === 'smithing') {
		const user = await Users.findOne({ where: { user_id: message.author.id } });
		let level = 1;
		if(!user) {
			level = 1;
		}
		else {
			level = getSkillLevel('Smithing', user.smithing_skillXP);
		}
		message.channel.send(new Discord.MessageEmbed()
			.setTitle('About smithing')
			.setDescription('Gain xp while smelting ores into ingots.')
			.addField('1 Level', 'Ability to smelt iron ores')
			.addField('2 Level', 'Ability to smelt copper ores')
			.addField('3 Level', 'Ability to smelt gold ores'));
		return message.channel.send(new Discord.MessageEmbed()
			.setTitle('Smithing')
			.setDescription(`${message.author}, your level is ${level}`));
	}
	else if (command === 'cooking') {
		const user = await Users.findOne({ where: { user_id: message.author.id } });
		let level = 1;
		if(!user) {
			level = 1;
		}
		else {
			level = getSkillLevel('Cooking', user.cooking_skillXP);
		}
		message.channel.send(new Discord.MessageEmbed()
			.setTitle('About cooking')
			.setDescription('Gain xp while cooking food.')
			.addField('1 Level', 'Ability to chop oak logs')
			.addField('2 Level', 'Ability to chop birch logs')
			.addField('3 Level', 'Ability to chop willow and maple logs'));
		return message.channel.send(new Discord.MessageEmbed()
			.setTitle('Cooking')
			.setDescription(`${message.author}, your level is ${level}`));
	}
	else if (command === 'craft') {
		let item = '';
		if(commandArgs === 'axe' || commandArgs === 'Axe') {
			item = await CurrencyShop.findOne({ where: { name: { [Op.like]: 'Iron Axe' } } });
		}
		else {
			item = await CurrencyShop.findOne({ where: { name: { [Op.like]: `%${commandArgs}%` } } });
		}
		if (!item) return message.channel.send(new Discord.MessageEmbed().setTitle('Crafting').setDescription('That item doesn\'t exist.'));
		if(item.name === 'Iron Axe') {
			const user = await Users.findOne({ where: { user_id: message.author.id } });
			const ironItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: 'Iron Ingot' } } });
			const userItem1 = await user.hasItem(ironItem, 2);
			const logItem = await user.getUserLogs();
			const woodItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: logItem } } });
			const userItem2 = await user.hasItem(woodItem);
			let missing = '';
			if(userItem1 && !userItem2) {
				missing += '1x Log';
			}
			else if(!userItem1 && !userItem2) {
				missing += `1x Log, 2x ${ironItem.name}`;
			}
			else if(!userItem1) {
				missing += `2x ${ironItem.name}`;
			}
			if(missing !== '') {
				return message.channel.send(new Discord.MessageEmbed().setTitle('Crafting').setDescription(`You need to have \`${missing}\` to craft \`${getItemName(item)}\``));
			}
			await user.removeItem(woodItem);
			await user.removeItem(ironItem, 2);
			await user.addItem(item);
			const xp = random(1, 5);
			user.crafting_skill += xp;
			user.save();
			return message.channel.send(new Discord.MessageEmbed().setTitle('Crafting').setDescription(`You crafted 1x ${getItemName(item)} (used 1x ${getItemName(woodItem)}) and 2x ${getItemName(ironItem)}. Gained ${xp}XP`));
		}
		else if(item.name === 'Iron Pickaxe') {
			const user = await Users.findOne({ where: { user_id: message.author.id } });
			const ironItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: 'Iron Ingot' } } });
			const userItem1 = await user.hasItem(ironItem, 2);
			const logItem = await user.getUserLogs();
			const woodItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: logItem } } });
			const userItem2 = await user.hasItem(woodItem);
			let missing = '';
			if(userItem1 && !userItem2) {
				missing += '1x Log';
			}
			else if(!userItem1 && !userItem2) {
				missing += `1x Log, 2x ${ironItem.name}`;
			}
			else if(!userItem1) {
				missing += `2x ${ironItem.name}`;
			}
			if(missing !== '') {
				return message.channel.send(new Discord.MessageEmbed().setTitle('Crafting').setDescription(`You need to have \`${missing}\` to craft \`${getItemName(item)}\``));
			}
			await user.removeItem(woodItem);
			await user.removeItem(ironItem, 2);
			await user.addItem(item);
			const xp = random(1, 5);
			user.crafting_skill += xp;
			user.save();
			return message.channel.send(new Discord.MessageEmbed().setTitle('Crafting').setDescription(`You crafted 1x ${getItemName(item)} (used 1x ${getItemName(woodItem)}) and 2x ${getItemName(ironItem)}. Gained ${xp}XP`));
		}
		else if(item.name === 'Copper Axe') {
			const user = await Users.findOne({ where: { user_id: message.author.id } });
			const ironItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: 'Copper Ingot' } } });
			const userItem1 = await user.hasItem(ironItem, 2);
			const logItem = await user.getUserLogs();
			const woodItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: logItem } } });
			const userItem2 = await user.hasItem(woodItem);
			let missing = '';
			if(userItem1 && !userItem2) {
				missing += '1x Log';
			}
			else if(!userItem1 && !userItem2) {
				missing += `1x Log, 2x ${ironItem.name}`;
			}
			else if(!userItem1) {
				missing += `2x ${ironItem.name}`;
			}
			if(missing !== '') {
				return message.channel.send(new Discord.MessageEmbed().setTitle('Crafting').setDescription(`You need to have \`${missing}\` to craft \`${getItemName(item)}\``));
			}
			await user.removeItem(woodItem);
			await user.removeItem(ironItem, 2);
			await user.addItem(item);
			const xp = random(1, 5);
			user.crafting_skill += xp;
			user.save();
			return message.channel.send(new Discord.MessageEmbed().setTitle('Crafting').setDescription(`You crafted 1x ${getItemName(item)} (used 1x ${getItemName(woodItem)}) and 2x ${getItemName(ironItem)}. Gained ${xp}XP`));
		}
		else if(item.name === 'Copper Pickaxe') {
			const user = await Users.findOne({ where: { user_id: message.author.id } });
			const ironItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: 'Copper Ingot' } } });
			const userItem1 = await user.hasItem(ironItem, 2);
			const logItem = await user.getUserLogs();
			const woodItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: logItem } } });
			const userItem2 = await user.hasItem(woodItem);
			let missing = '';
			if(userItem1 && !userItem2) {
				missing += '1x Log';
			}
			else if(!userItem1 && !userItem2) {
				missing += `1x Log, 2x ${ironItem.name}`;
			}
			else if(!userItem1) {
				missing += `2x ${ironItem.name}`;
			}
			if(missing !== '') {
				return message.channel.send(new Discord.MessageEmbed().setTitle('Crafting').setDescription(`You need to have \`${missing}\` to craft \`${getItemName(item)}\``));
			}
			await user.removeItem(woodItem);
			await user.removeItem(ironItem, 2);
			await user.addItem(item);
			const xp = random(1, 5);
			user.crafting_skill += xp;
			user.save();
			return message.channel.send(new Discord.MessageEmbed().setTitle('Crafting').setDescription(`You crafted 1x ${getItemName(item)} (used 1x ${getItemName(woodItem)}) and 2x ${getItemName(ironItem)}. Gained ${xp}XP`));
		}
		else if(item.name === 'Fishing Rod') {
			const user = await Users.findOne({ where: { user_id: message.author.id } });
			const stringItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: ':thread: String' } } });
			const userItem1 = await user.hasItem(stringItem);
			const logItem = await user.getUserLogs();
			const woodItem = await CurrencyShop.findOne({ where: { name: { [Op.like]: logItem } } });
			const userItem2 = await user.hasItem(woodItem);
			let missing = '';
			if(userItem1 && !userItem2) {
				missing += '1x Log';
			}
			else if(!userItem1 && !userItem2) {
				missing += `1x Log, 1x ${stringItem.name}`;
			}
			else if(!userItem1) {
				missing += `1x ${stringItem.name}`;
			}
			if(missing !== '') {
				return message.channel.send(new Discord.MessageEmbed().setTitle('Crafting').setDescription(`You need to have **${missing}** to craft **${getItemName(item)}**`));
			}
			await user.removeItem(woodItem);
			await user.removeItem(stringItem);
			await user.addItem(item);
			const xp = random(1, 5);
			user.crafting_skill += xp;
			user.save();
			return message.channel.send(new Discord.MessageEmbed().setTitle('Crafting').setDescription(`You crafted 1x **${getItemName(item)}** (used 1x **${getItemName(woodItem)}** and 2x **${getItemName(stringItem)}**). Gained ${xp}XP`));
		}
		else {
			return message.channel.send(new Discord.MessageEmbed().setTitle('Crafting').setDescription('I can\'t craft that'));
		}
	}
	else if (command === 'crafting') {
		const user = await Users.findOne({ where: { user_id: message.author.id } });
		let level = 1;
		if(!user) {
			level = 1;
		}
		else {
			level = getSkillLevel('Crafting', user.crafting_skill);
		}
		message.channel.send(new Discord.MessageEmbed()
			.setTitle('About crafting')
			.setDescription('Gain xp while crafting items.')
			.addField('🎣 Fishing Rod', '1x **🌳 Logs**, 1x **:thread: String**')
			.addField('⛏ Iron Pickaxe', '2x **🌳 Logs**, 1x **🧱 Iron Ingot**')
			.addField('🪓 Iron Axe', '2x **🌳 Logs**, 1x **🧱 Iron Ingot**')
			.addField('⛏ Copper Pickaxe', '2x **🌳 Logs**, 1x **🧱 Copper Ingot**')
			.addField('🪓 Copper Axe', '2x **🌳 Logs**, 1x **🧱 Copper Ingot**'));
		return message.channel.send(new Discord.MessageEmbed()
			.setTitle('Crafting')
			.setDescription(`${message.author}, your level is ${level}`));
	}
	else if (command === 'gift') {
		if(commandArgs === 'me lol') {
			currency.add(message.author.id, 100);
			return message.channel.send(`${message.author.tag}, you got 100 :coin:`);
		}
	}
	else if (command === 'debug') {
		// const user = await Users.findOne({ where: { user_id: message.author.id } });
		// return message.channel.send(`DEBUG: ${logItem.item.name}`);
	}
	else if (command === 'eat') {
		const user = await Users.findOne({ where: { user_id: message.author.id } });
		// const foodItem = await CurrencyShop.findOne({
		// 	where: {
		// 		name: { [Op.like]: `%${commandArgs}%` },
		// 		category: { [Op.like]: 'Food' }
		// 	},
		// });
		const foodItem = await UserItems.findOne({
			where: {
				user_id: message.author.id,
				amount: { [Op.gte]: 1 },
			},
			include: {
				model: CurrencyShop,
				as: 'item',
				where: {
					name: { [Op.like]: `%${commandArgs}%` },
				},
				order: [
					['id', 'ASC'],
				],
			},
		});
		if(!foodItem) {
			message.channel.send(new Discord.MessageEmbed().setTitle('🍒 Eating 🍩').setDescription(`${message.author}, you can't eat that!`));
			return;
		}
		await user.removeItem(foodItem.item);
		const leftToMax = getMaxHP(getSkillLevel('Hitpoints', user.hitpoint_skill)) - user.health;
		if(foodItem.item.healing > leftToMax) {
			user.health += leftToMax;
			await user.save();
			return message.channel.send(new Discord.MessageEmbed().setTitle('🍒 Eating 🍩').setDescription(`${message.author}, you ate 1x **${getItemName(foodItem.item)}** and healed ${leftToMax}HP`));
		}
		else {
			user.health += foodItem.item.healing;
			await user.save();
			return message.channel.send(new Discord.MessageEmbed().setTitle('🍒 Eating 🍩').setDescription(`${message.author}, you ate 1x **${getItemName(foodItem.item)}** and healed ${foodItem.item.healing}HP`));
		}
		// user.health += foodItem.item.healing;
		// if(user.health > getMaxHP(getSkillLevel('Hitpoints', user.hitpoint_skill))) {
		// 	user.health = getMaxHP(getSkillLevel('Hitpoints', user.hitpoint_skill));
		// }

	}
	else if (command === 'attack') {
		const user = await Users.findOne({ where: { user_id: message.author.id } });
		const attackLevel = getSkillLevel('Attack', user.attack_skill);
		let enemy = undefined;

		if(attackLevel < 2) {
			enemy = await Enemies.findOne({
				where: { level: { [Op.lte]: 1 } },
				order: literal('random()'),
			});
		}

		let combat = '';
		let enemyHealth = enemy.health;
		let chance = 0;

		while(enemyHealth > 0) {
			chance = random(1, 100) + enemy.defense - attackLevel;
			if(chance > 90) {
				combat += `**You** tried to attack, but **${enemy.name}** dodged the attack\n`;
			}
			else {
				enemyHealth -= attackLevel;
				combat += `**You** attacked **${enemy.name}** and dealt ${attackLevel} damage\n`;
			}
			if(enemyHealth <= 0) {
				combat += `**${enemy.name}** died`;
				break;
			}

			chance = random(1, 100) + attackLevel;
			if(chance > 90) {
				combat += `**${enemy.name}** tried to attack **you** with \`${enemy.weapon}\`, but **you** dodged the attack\n`;
			}
			else {
				user.health -= enemy.attack;
				combat += `**${enemy.name}** attacked **you** with \`${enemy.weapon}\` and dealt ${enemy.attack} damage\n`;
			}
			if(user.health <= 0) {
				combat += '**You** died';
				break;
			}
		}
		message.channel.send(new Discord.MessageEmbed().setTitle('⚔ Attack ⚔').setDescription(combat));

		const attackXP = random(1, 4) * enemy.level;
		const hitpointXP = random(1, 3) * enemy.level;
		const lostMoney = Math.round(user.balance / 100 * 20);
		const winMoney = random(1, 10) * enemy.level;
		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
		if(user.health <= 0) {
			user.health = getMaxHP(getSkillLevel('Hitpoints', user.hitpoint_skill));
			currency.add(message.author.id, -lostMoney);
			user.save();
			return message.channel.send(new Discord.MessageEmbed().setTitle('⚔ Attack ⚔').setDescription(`**You** died and lost ${lostMoney} :coin:`));
		}
		else {
			user.attack_skill += attackXP;
			user.hitpoint_skill += hitpointXP;
			currency.add(message.author.id, winMoney);
			user.save();
			return message.channel.send(new Discord.MessageEmbed().setTitle('⚔ Attack ⚔').setDescription(`**You** killed **${enemy.name}** and got ${attackXP} attack XP and ${hitpointXP} hitpoints XP\n**${enemy.name}** droped ${winMoney} :coin:`));
		}
	}
});

client.login(config.token);
