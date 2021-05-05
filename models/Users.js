module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		balance: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
		health: {
			type: DataTypes.INTEGER,
			defaultValue: 10,
			allowNull: false,
		},
		house: {
			type: DataTypes.STRING,
			defaultValue: 'Homeless',
			allowNull: false,
		},
		action: {
			type: DataTypes.STRING,
			defaultValue: 'Idle',
			allowNull: false,
		},
		woodcutting_skill: {
			type: DataTypes.DOUBLE,
			defaultValue: '0.00',
			allowNull: false,
		},
		mining_skill: {
			type: DataTypes.DOUBLE,
			defaultValue: '0.00',
			allowNull: false,
		},
		fishing_skill: {
			type: DataTypes.DOUBLE,
			defaultValue: '0.00',
			allowNull: false,
		},
		cooking_skill: {
			type: DataTypes.DOUBLE,
			defaultValue: '0.00',
			allowNull: false,
		},
		smithing_skill: {
			type: DataTypes.DOUBLE,
			defaultValue: '0.00',
			allowNull: false,
		},
		crafting_skill: {
			type: DataTypes.DOUBLE,
			defaultValue: '0.00',
			allowNull: false,
		},
		hitpoint_skill: {
			type: DataTypes.DOUBLE,
			defaultValue: '0.00',
			allowNull: false,
		},
		attack_skill: {
			type: DataTypes.DOUBLE,
			defaultValue: '0.00',
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};