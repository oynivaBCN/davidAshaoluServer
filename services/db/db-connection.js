require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../../config')[process.env.NODE_ENV];
const RolesModel = require('./models/roles');

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
	host: dbConfig.host,
	dialect: dbConfig.dialect,
	dialectOptions: {
		allowPublicKeyRetrieval: dbConfig.allowPublicKeyRetrieval,
	},
});

const authenticateDB = async () => {
	try {
		await sequelize.authenticate();
		console.log('Connection has been established successfully.');
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
};

const Roles = RolesModel(sequelize, DataTypes);

// sequelize.sync().then(() => {
//   // Roles.create({
//   //     "role": "other"
//     Roles.findAll({
//   }).then(res => {
//       console.log(res)
//   }).catch((error) => {
//       console.error('Failed: ', error);
//   });
// }).catch((error) => {
//   console.error('Catch error: ', error);
// });

module.exports = { sequelize, authenticateDB };