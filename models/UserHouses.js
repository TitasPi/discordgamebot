module.exports = (sequelize, DataTypes) => {
	return sequelize.define('user_house', {
		user_id: DataTypes.STRING,
		house_id: DataTypes.STRING,
	}, {
		timestamps: false,
	});
};