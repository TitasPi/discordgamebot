module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user_item', {
        user_id: DataTypes.STRING,
        item_id: DataTypes.STRING,
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            'default': 0,
        },
        durability: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: -1,
        },
    }, {
        timestamps: false,
    });
};