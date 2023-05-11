require('dotenv').config();
const mariadb = require('mariadb');
const Config = require('../../config');
const { createTunnel } = require('tunnel-ssh');
const fs = require('fs');

const tunnelOptions = {
	autoClose: true,
};

const serverOptions = {
	host: Config.tunnel.host,
	port: Config.tunnel.port,
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
	srcAddr: Config.tunnel.host,
	srcPort: Config.tunnel.port,
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
				host: Config.tunnel.host,
				port: Config.tunnel.port,
				user: Config.db.username,
				password: Config.db.password,
				database: Config.db.database,
				debug: true,
				connectionLimit: 10,
				idleTimeout: 190000,
				acquireTimeout: 190000,
				socketTimeout: 190000,
				connectTimeout: 190000,
				trace: true,
			});
			conn = await pool.getConnection();
			// console.log('Total connections: ', pool.totalConnections());
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
