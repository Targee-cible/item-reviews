require('dotenv').config();
const mongoose = require('mongoose');

// const { DB_HOST } = process.env;

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/reviews';

mongoose.connect(mongoUri, { useNewUrlParser: true, useCreateIndex: true });

const db = mongoose.connection;

// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;
