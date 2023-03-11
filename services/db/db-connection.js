require('dotenv').config();
const mariadb = require('mariadb');
const Config = require('../../config');

const pool = mariadb.createPool({
	host: Config.db.host,
	user: Config.db.username,
	password: Config.db.password,
	database: Config.db.database,
	connectionLimit: 10,
});

const dbConn = async (dbQuery) => {
	// console.log('Total connections start: ', pool.totalConnections());
	let conn;
	try {
		conn = await pool.getConnection();
		// console.log('Total connections get: ', pool.totalConnections());

		return await conn.query(dbQuery);
	} catch (err) {
		console.error(err);
	} finally {
		if (conn) conn.end();
		// console.log('Total connections end: ', pool.totalConnections());
		// console.log('Active connections: ', pool.activeConnections());
		// console.log('Idle connections: ', pool.idleConnections());
	}
};

module.exports = { dbConn };

// RESOURCES
// https://mariadb.com/docs/xpand/connect/programming-languages/nodejs/promise/connection-pools/https://mariadb.com/docs/xpand/connect/programming-languages/nodejs/promise/connection-pools/
