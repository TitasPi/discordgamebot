module.exports = (sequelize, DataTypes) => {
    return sequelize.define('home_shop', {
        name: {
            type: DataTypes.STRING,
            unique: true,
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
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        timestamps: false,
    });
};