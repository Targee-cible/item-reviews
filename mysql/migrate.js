const mysql = require('mysql');
const createDbAndTables = require('./migrate');
const Promise = require('bluebird');
require('dotenv').config();

const database = process.env.MYSQL_DB || 'tcreviews';

// intialize to connect to mysql without Database yet
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST || 'localhost',
	user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  multipleStatements: true
});


const SQL_SCRIPT = `
DROP DATABASE IF EXISTS ${database};
CREATE DATABASE ${database};
USE ${database};

CREATE TABLE reviews (
  id integer AUTO_INCREMENT PRIMARY KEY,
  title varchar(255),
  review text,
  customerName varchar(255),
  purchaseDate date,
  productId integer,
  helpful boolean,
  recommend boolean
);

CREATE TABLE ratings (
  id integer AUTO_INCREMENT PRIMARY KEY,
  reviewId integer,
  overall smallInt,
  quality smallInt,
  sizing smallInt,
  style smallInt,
  value smallInt,
  comfort smallInt
);
`;

const db = Promise.promisifyAll(connection, { multiArgs: true });

db.connectAsync()
  .then(() => console.log(`Connected to ${database} database as ID ${db.threadId}`))
  .then(() => {
    /*if (!db.queryAsync) {
      db = Promise.promisifyAll(db);
    }*/
    // Create Database and tables
    return db.queryAsync(SQL_SCRIPT)
      .then(() => {
        console.log('Database structure created successfully');
        // end connection
        db.end();
      })
      .error(err => {
        console.log('Migration error', err);
      });
  });
