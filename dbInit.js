console.time('execution');
const Sequelize = require('sequelize');
const Logger = require('./utils/logger');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

const CurrencyShop = require('./models/CurrencyShop')(sequelize, Sequelize.DataTypes);
const HouseShop = require('./models/HouseShop')(sequelize, Sequelize.DataTypes);
const PetShop = require('./models/PetShop')(sequelize, Sequelize.DataTypes);
const Enemies = require('./models/Enemies')(sequelize, Sequelize.DataTypes);
require('./models/Users')(sequelize, Sequelize.DataTypes);
require('./models/UserItems')(sequelize, Sequelize.DataTypes);
require('./models/UserHouses')(sequelize, Sequelize.DataTypes);
require('./models/UserPets')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
    const shop = [
        await Enemies.upsert({ name: 'Hobo', level: 1, health: 5, attack: 1, defense: 0, weapon: '👊 Hand' }),
        await Enemies.upsert({ name: 'Dog', level: 1, health: 5, attack: 1, defense: 1, weapon: 'Paw' }),
        await Enemies.upsert({ name: 'Hooker', level: 2, health: 5, attack: 3, defense: 1, weapon: 'Nails' }),

        await HouseShop.upsert({ name: 'Homeless', buyPrice: 0, sellPrice: 0, buyable: 0, sellable: 0, stock: 0 }),
        await HouseShop.upsert({ name: 'Small cardboard box', buyPrice: 50, sellPrice: 30, buyable: 1, sellable: 1, stock: 5 }),
        await HouseShop.upsert({ name: 'Dog house', buyPrice: 60, sellPrice: 45, buyable: 1, sellable: 1, stock: 5 }),
        await HouseShop.upsert({ name: 'Tent', buyPrice: 100, sellPrice: 60, buyable: 1, sellable: 1, stock: 5 }),
        await HouseShop.upsert({ name: 'One room apartment', buyPrice: 250, sellPrice: 230, buyable: 1, sellable: 1, stock: 5 }),

        await PetShop.upsert({ name: '🐶 Dog (Poodle)', buyPrice: 0, sellPrice: 0, buyable: 0, sellable: 0, stock: 0 }),
        await PetShop.upsert({ name: '🐕‍🦺 Dog (German Shepherd)', buyPrice: 0, sellPrice: 0, buyable: 0, sellable: 0, stock: 0 }),
        await PetShop.upsert({ name: '🐱 Cat', buyPrice: 0, sellPrice: 0, buyable: 0, sellable: 0, stock: 0 }),
        await PetShop.upsert({ name: '🐢 Turtle', buyPrice: 0, sellPrice: 0, buyable: 0, sellable: 0, stock: 0 }),
        await PetShop.upsert({ name: '🐍 Snake', buyPrice: 0, sellPrice: 0, buyable: 0, sellable: 0, stock: 0 }),
        await PetShop.upsert({ name: '🐌 Snail', buyPrice: 0, sellPrice: 0, buyable: 0, sellable: 0, stock: 0 }),
        await PetShop.upsert({ name: '🦊 Fox', buyPrice: 0, sellPrice: 0, buyable: 0, sellable: 0, stock: 0 }),
        await PetShop.upsert({ name: '🦄 Unicorn (VIP)', buyPrice: 0, sellPrice: 0, buyable: 0, sellable: 0, stock: 0 }),
        await PetShop.upsert({ name: '🐲 Dragon (VIP)', buyPrice: 0, sellPrice: 0, buyable: 0, sellable: 0, stock: 0 }),
        await PetShop.upsert({ name: '🐰 Rabbit', buyPrice: 0, sellPrice: 0, buyable: 0, sellable: 0, stock: 0 }),

        // await CurrencyShop.upsert({ name: '🍵 Tea', category: 'Food', buyPrice: 1, sellPrice: 0, buyable: 1, sellable: 0, healing: 2, stock: 0 }),
        // await CurrencyShop.upsert({ name: '☕ Coffee', category: 'Food', buyPrice: 2, sellPrice: 0, buyable: 1, sellable: 0, healing: 3, stock: 0 }),
        // await CurrencyShop.upsert({ name: '🍰 Cake', category: 'Food', buyPrice: 5, sellPrice: 0, buyable: 1, sellable: 0, healing: 5, stock: 0 }),
        await CurrencyShop.upsert({ name: '🐟 Cooked Cod', category: 'Food', buyPrice: 8, sellPrice: 5, buyable: 1, sellable: 1, healing: 5, stock: 0 }),
        await CurrencyShop.upsert({ name: '🐟 Cooked Salmon', category: 'Food', buyPrice: 8, sellPrice: 5, buyable: 1, sellable: 1, healing: 5, stock: 0 }),
        await CurrencyShop.upsert({ name: '🐟 Cooked Carp', category: 'Food', buyPrice: 8, sellPrice: 5, buyable: 1, sellable: 1, healing: 5, stock: 0 }),
        await CurrencyShop.upsert({ name: '🐟 Cooked Mackerel', category: 'Food', buyPrice: 8, sellPrice: 5, buyable: 1, sellable: 1, healing: 5, stock: 0 }),
        await CurrencyShop.upsert({ name: '🐟 Cooked Herring', category: 'Food', buyPrice: 8, sellPrice: 5, buyable: 1, sellable: 1, healing: 5, stock: 0 }),
        await CurrencyShop.upsert({ name: '🐟 Cooked Trout', category: 'Food', buyPrice: 8, sellPrice: 5, buyable: 1, sellable: 1, healing: 5, stock: 0 }),
        await CurrencyShop.upsert({ name: 'Iron Pickaxe', category: 'Mining', buyPrice: 15, sellPrice: 12, buyable: 1, sellable: 1, durability: 5, stock: 5 }),
        await CurrencyShop.upsert({ name: 'Copper Pickaxe', category: 'Mining', buyPrice: 20, sellPrice: 15, buyable: 1, sellable: 1, durability: 15, stock: 0 }),
        await CurrencyShop.upsert({ name: 'Coal', category: 'Mining', buyPrice: 0, sellPrice: 1, buyable: 0, sellable: 1, stock: 0 }),
        await CurrencyShop.upsert({ name: 'Iron Ore', category: 'Mining', buyPrice: 0, sellPrice: 3, buyable: 0, sellable: 1, stock: 0 }),
        await CurrencyShop.upsert({ name: 'Copper Ore', category: 'Mining', buyPrice: 0, sellPrice: 4, buyable: 0, sellable: 1, stock: 0 }),
        await CurrencyShop.upsert({ name: 'Gold Ore', category: 'Mining', buyPrice: 0, sellPrice: 6, buyable: 0, sellable: 1, stock: 0 }),
        await CurrencyShop.upsert({ name: 'Iron Ingot', category: 'Mining', buyPrice: 0, sellPrice: 6, buyable: 0, sellable: 1, stock: 0 }),
        await CurrencyShop.upsert({ name: 'Copper Ingot', category: 'Mining', buyPrice: 0, sellPrice: 8, buyable: 0, sellable: 1, stock: 0 }),
        await CurrencyShop.upsert({ name: 'Gold Ingot', category: 'Mining', buyPrice: 0, sellPrice: 12, buyable: 0, sellable: 1, stock: 0 }),
        await CurrencyShop.upsert({ name: 'Iron Axe', category: 'Woodcutting', buyPrice: 15, sellPrice: 12, buyable: 1, sellable: 1, durability: 5, stock: 5 }),
        await CurrencyShop.upsert({ name: 'Copper Axe', category: 'Woodcutting', buyPrice: 20, sellPrice: 15, buyable: 1, sellable: 1, durability: 15, stock: 0 }),
        await CurrencyShop.upsert({ name: 'Oak Log', category: 'Woodcutting', buyPrice: 0, sellPrice: 2, buyable: 0, sellable: 1, stock: 0 }),
        await CurrencyShop.upsert({ name: 'Birch Log', category: 'Woodcutting', buyPrice: 0, sellPrice: 4, buyable: 0, sellable: 1, stock: 0 }),
        await CurrencyShop.upsert({ name: 'Willow Log', category: 'Woodcutting', buyPrice: 0, sellPrice: 5, buyable: 0, sellable: 1, stock: 0 }),
        await CurrencyShop.upsert({ name: 'Maple Log', category: 'Woodcutting', buyPrice: 0, sellPrice: 5, buyable: 0, sellable: 1, stock: 0 }),
        await CurrencyShop.upsert({ name: 'Fishing Rod', category: 'Fishing', buyPrice: 10, sellPrice: 8, buyable: 1, sellable: 1, durability: 5, stock: 5 }),
        await CurrencyShop.upsert({ name: 'Raw Cod', category: 'Fishing', buyPrice: 3, sellPrice: 2, buyable: 1, sellable: 1, stock: 0 }),
        await CurrencyShop.upsert({ name: 'Raw Salmon', category: 'Fishing', buyPrice: 3, sellPrice: 2, buyable: 1, sellable: 1, stock: 0 }),
        await CurrencyShop.upsert({ name: 'Raw Carp', category: 'Fishing', buyPrice: 3, sellPrice: 2, buyable: 1, sellable: 1, stock: 0 }),
        await CurrencyShop.upsert({ name: 'Raw Mackerel', category: 'Fishing', buyPrice: 3, sellPrice: 2, buyable: 1, sellable: 1, stock: 0 }),
        await CurrencyShop.upsert({ name: 'Raw Herring', category: 'Fishing', buyPrice: 3, sellPrice: 2, buyable: 1, sellable: 1, stock: 0 }),
        await CurrencyShop.upsert({ name: 'Raw Trout', category: 'Fishing', buyPrice: 3, sellPrice: 2, buyable: 1, sellable: 1, stock: 0 }),
        await CurrencyShop.upsert({ name: '📰 Newspaper', category: 'Junk', buyPrice: 0, sellPrice: 1, buyable: 0, sellable: 1, stock: 0 }),
        await CurrencyShop.upsert({ name: '🏀 Basketball ball', category: 'Junk', buyPrice: 0, sellPrice: 1, buyable: 0, sellable: 1, stock: 0 }),
        await CurrencyShop.upsert({ name: '👠 Shoe', category: 'Junk', buyPrice: 0, sellPrice: 1, buyable: 0, sellable: 1, stock: 0 }),
        await CurrencyShop.upsert({ name: '☂ Umbrella', category: 'Junk', buyPrice: 0, sellPrice: 3, buyable: 0, sellable: 1, stock: 0 }),
        await CurrencyShop.upsert({ name: ':thread: String', category: 'Junk', buyPrice: 0, sellPrice: 2, buyable: 0, sellable: 1, stock: 0 }),
    ];
    await Promise.all(shop);
    Logger.log('Database synced');
    sequelize.close();
    console.timeEnd('execution');
}).catch(console.error);
