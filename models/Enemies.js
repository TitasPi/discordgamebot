module.exports = (sequelize, DataTypes) => {
	return sequelize.define('enemies', {
		enemy_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		level: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
			allowNull: false,
		},
		health: {
			type: DataTypes.INTEGER,
			defaultValue: 10,
			allowNull: false,
		},
		attack: {
			type: DataTypes.INTEGER,
			defaultValue: 1,
			allowNull: false,
		},
		defense: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		weapon: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};