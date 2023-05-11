require('dotenv').config();
const mariadb = require('mariadb');
const Config = require('../../config');
const { createTunnel } = require('tunnel-ssh');
const fs = require('fs');

const HOST = '127.0.0.1';
const PORT = 3306;

const tunnelOptions = {
	autoClose: true,
};

const serverOptions = {
	host: HOST,
	port: PORT,
	keepAlive: true,
};

const sshOptions = {
	host: Config.ec2.ec2InstanceIP,
	username: Config.ec2.ec2InstanceUsername,
	port: Config.ec2.port,
	privateKey: fs.readFileSync(process.env.PATH_TO_PRIVATE_KEY),
	readyTimeout: 100000,
};

const forwardOptions = {
	srcAddr: HOST,
	srcPort: PORT,
	dstAddr: Config.db.host,
	dstPort: Config.db.port,
};

const connectToRds = async (dbQuery, dbParams = null) => {
	try {
		await createTunnel(tunnelOptions, serverOptions, sshOptions, forwardOptions);
		console.log('SSH tunnel established');

		let pool;
		let conn;

		try {
			pool = mariadb.createPool({
				host: HOST,
				port: PORT,
				user: Config.db.username,
				password: Config.db.password,
				database: Config.db.database,
				// socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
				debug: true,
				connectionLimit: 10,
				idleTimeout: 190000,
				acquireTimeout: 190000,
				socketTimeout: 190000,
				connectTimeout: 190000,
				trace: true,
			});
			console.log('Total connections start: ', pool.totalConnections());
			conn = await pool.getConnection();
			console.log('Total connections start INIT: ', pool.totalConnections());
			const rows = dbParams ? await conn.query(dbQuery, dbParams) : await conn.query(dbQuery);
			return rows;
		} catch (error) {
			console.error('db-err::', error);
		} finally {
			if (conn) conn.end();
			if (pool) pool.end();
		}
	} catch (error) {
		console.error('ssh-err::', error);
	}
};

module.exports = { connectToRds };

// RESOURCES
// https://mariadb.com/docs/xpand/connect/programming-languages/nodejs/promise/connection-pools/
