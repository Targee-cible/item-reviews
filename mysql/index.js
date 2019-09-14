const mysql = require('mysql');
const Promise = require('bluebird');
require('dotenv').config();

const database = process.env.MYSQL_DB || 'tcreviews';

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST || 'localhost',
	user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: database,
  multipleStatements: true
});

const db = Promise.promisifyAll(connection, { multiArgs: true });

db.connectAsync()
  .then(() => console.log(`Connected to ${database} database as ID ${db.threadId}`));

module.exports = db;