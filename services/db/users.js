const database = require('../db/db-connection');

const getUsers = async () => {
	const query = `SELECT * from davidashaolu.users`;
	return await database.dbConn(query);
};

const getUserBySub = async (sub) => {
	const query = `SELECT * from davidashaolu.users WHERE users.sub = "${sub}"`;
	const result = await database.dbConn(query);
	return result.length ? result[0] : null;
};

const createUser = async (sub, role) => {
	const query = `INSERT INTO users (sub, role) VALUES ("${sub}", "${role}")`;
	return await database.dbConn(query);
};
const users = { getUsers, getUserBySub, createUser };

module.exports = { users };
