const database = require('../db-connection');

const getUsers = async () => {
	const query = `SELECT * from da.users;`;
	return await database.connectToRds(query);
};

const getUserBySub = async (sub) => {
	const query = `SELECT * from da.users WHERE sub = ?;`;
	const params = [sub];
	const result = await database.connectToRds(query, params);
	return result?.length ? result[0] : null;
};

const createUser = async (sub, role) => {
	const query = `INSERT INTO users (sub, role) VALUES (?, ?)`;
	const params = [sub, role];
	return await database.connectToRds(query, params);
};
const users = { getUsers, getUserBySub, createUser };

module.exports = { users };
