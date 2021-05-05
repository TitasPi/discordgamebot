const Sequelize = require('sequelize');
const { Op } = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

const Users = require('./models/Users')(sequelize, Sequelize.DataTypes);
const CurrencyShop = require('./models/CurrencyShop')(sequelize, Sequelize.DataTypes);
const HouseShop = require('./models/HouseShop')(sequelize, Sequelize.DataTypes);
const UserItems = require('./models/UserItems')(sequelize, Sequelize.DataTypes);
const UserHouses = require('./models/UserHouses')(sequelize, Sequelize.DataTypes);
const Enemies = require('./models/Enemies')(sequelize, Sequelize.DataTypes);

UserItems.belongsTo(CurrencyShop, { foreignKey: 'item_id', as: 'item' });
UserHouses.belongsTo(HouseShop, { foreignKey: 'house_id', as: 'item' });

/* eslint-disable-next-line func-names */
Users.prototype.addItem = async function(item, quantity = 1) {
    const useritem = await UserItems.findOne({
        where: { user_id: this.user_id, item_id: item.id },
    });

    if (useritem) {
        useritem.amount += quantity;
        return useritem.save();
    }

    return UserItems.create({ user_id: this.user_id, item_id: item.id, amount: quantity, durability: item.durability });
};

Users.prototype.addHouse = async function(item) {
    const userHouse = await UserHouses.findOne({
        where: { user_id: this.user_id, house_id: item.id },
    });

    if (userHouse) {
        userHouse.amount += 1;
        return userHouse.save();
    }

    return UserHouses.create({ user_id: this.user_id, house_id: item.id, amount: 1 });
};
Users.prototype.removeHouse = async function(item) {
    return await UserHouses.destroy({
        where: { user_id: this.user_id, house_id: item.id },
    });
};
Users.prototype.sellItem = async function(item, quantity = 1) {
    const useritem = await UserItems.findOne({
        where: { user_id: this.user_id, item_id: item.id },
    });

    useritem.amount -= quantity;
    if(useritem.amount == 0) {
        return await UserItems.destroy({
            where: { user_id: this.user_id, item_id: item.id },
        });
    }
    return useritem.save();
};
Users.prototype.sellAllItems = async function(item) {
    const useritem = await UserItems.findOne({
        where: { user_id: this.user_id, item_id: item.id },
    });
    const amount = useritem.amount;
    await UserItems.destroy({
        where: { user_id: this.user_id, item_id: item.id },
    });
    return amount;
};
Users.prototype.removeItem = async function(item, quantity = 1) {
    const useritem = await UserItems.findOne({
        where: { user_id: this.user_id, item_id: item.id },
    });

    useritem.amount -= quantity;
    if(useritem.amount == 0) {
        return await UserItems.destroy({
            where: { user_id: this.user_id, item_id: item.id },
        });
    }
    return useritem.save();
};

/* eslint-disable-next-line func-names */
Users.prototype.getItems = function() {
    return UserItems.findAll({
        where: { user_id: this.user_id },
        order: [
            ['item_id', 'ASC'],
        ],
        include: ['item'],
    });
};

/* eslint-disable-next-line func-names */
Users.prototype.getHouses = function() {
    return UserHouses.findAll({
        where: { user_id: this.user_id },
        include: ['item'],
    });
};

/* eslint-disable-next-line func-names */
Users.prototype.hasItem = async function(item, amount = 1) {
    const userItem = await UserItems.findOne({
        where: { user_id: this.user_id, item_id: item.id, amount: { [Op.gte]: amount } },
    });

    if(userItem) {
        return true;
    }
    else {
        return false;
    }
};

Users.prototype.getUserLogs = async function(amount = 1) {
    try {
        const userLog = await UserItems.findOne({
            where: {
                user_id: this.user_id,
                amount: { [Op.gte]: amount },
            },
            include: {
                model: CurrencyShop,
                as: 'item',
                where: {
                    name: { [Op.like]: '%Log%' },
                },
                order: [
                    ['id', 'ASC'],
                ],
            },
        });
        return userLog.item.name;
    }
    catch (error) {
        console.log(`Error occured: ${error}`);
        return 'Error occured';
    }

};

Users.prototype.getItem = async function(item) {
    return await UserItems.findOne({
        where: { user_id: this.user_id, item_id: item.id, amount: { [Op.gte]: 1 } },
    });
};

Users.prototype.hasHouse = async function(house) {
    const userHouse = await UserHouses.findOne({
        where: { user_id: this.user_id, house_id: house.id },
    });

    if(userHouse || house.name === 'Homeless') {
        return true;
    }
    else {
        return false;
    }
};

module.exports = { Users, CurrencyShop, UserItems, HouseShop, Enemies };