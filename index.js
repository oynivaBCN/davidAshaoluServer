const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const Routes = require('./routes');
const Config = require('./config');
// const DADB = require('./db/db-connection');

// DADB.sequelize
// DADB.authenticateDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

Routes(app);

app.listen(Config.port, () => {
	console.log(`Server listening on port ${Config.port}`);
});

module.exports = app;
