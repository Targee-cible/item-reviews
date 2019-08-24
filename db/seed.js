const db = require('./index.js');

const Reviews = require('../models/Reviews');
const Customers = require('../models/Customers');
const Products = require('../models/Products');

const genReviews = require('../mockdata/generate_reviews');
const genProducts = require('../mockdata/generate_products');
const genCustomers = require('../mockdata/generate_customers');

const seeds = {
  Reviews: genReviews(),
  Customers: genCustomers(),
  Products: genProducts(),
};

const removeDb = () => {
  Reviews.remove({})
    .then(Customers.remove({}))
    .then(Products.remove({}))
    // eslint-disable-next-line no-console
    .catch((error) => console.log(error));
};

const insertSeedData = () => {
  Reviews.create(seeds.Reviews.data)
    .then(() => Customers.create(seeds.Customers.data))
    .then(() => Products.create(seeds.Products.data))
    .then(() => db.close())
    // eslint-disable-next-line no-console
    .catch((error) => console.log(error));
};

removeDb();
insertSeedData();
