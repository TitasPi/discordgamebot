module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user_pets', {
        user_id: DataTypes.STRING,
        pet_id: DataTypes.STRING,
    }, {
        timestamps: false,
    });
};