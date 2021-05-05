module.exports = (sequelize, DataTypes) => {
    return sequelize.define('currency_shop', {
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        buyPrice: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sellPrice: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        buyable: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sellable: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        durability: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: -1,
        },
        healing: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: -1,
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });
};