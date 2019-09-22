require('dotenv').config();
require('newrelic');
const path = require('path');
const express = require('express');

const controllers = require('./controllers');
const ReviewController = require('./controllers/review');

const app = express();
const cors = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
};
app.use(cors);
app.use(express.static(path.join(__dirname, '../client/dist')));

app.use(express.json());

app.get('/', (req, res) => res.send('OK'));

// API Routes
app.get('/api/product/reviews', controllers);


// Create a new Review
app.post('/api/reviews', ReviewController.create);

// Retrieve all Review in not appropriate, we only get reviews of a specific product
app.get('/api/product/:productId/reviews', ReviewController.findFromProduct);

// Retrieve a single Review by Id
app.get('/api/reviews/:id', ReviewController.findOne);

// Update a Review with Id
app.put('/api/reviews/:id', ReviewController.update);

// Delete a Review with Id
app.delete('/api/reviews/:id', ReviewController.destroy);


module.exports = app;
