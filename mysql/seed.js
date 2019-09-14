const mysql = require('mysql');
require('dotenv').config();

const generator = require('./../data/reviews.js');

// Generate a batch of N data and insert N records at once in MySQL Database
// Do Recursion until we reach the target size of 10M
let targetSize = 10 * 1000 * 1000;
let batchSize = 10 * 1000;

var getMysqlScripts = (fromId, toId) => {
  const data = generator.generateReviewsAndRatings(fromId, toId);

  // REVIEWS SCRIPT
  var REVIEWS_SCRIPT = `INSERT INTO reviews(id, title, review, customerName, purchaseDate, productId, helpful, recommend) VALUES `;
  var REVIEWS_VALUES_SCRIPT = data.reviews.map((review) => {
    var reviewVals = Object.values(review);
    reviewVals = reviewVals.map((val) => {
      return '?';
    });

    return `(${reviewVals.join(', ')})`;
  }).join(', ') + ';';

  var reviewsValues = [];

  data.reviews.forEach((review) => {
    var reviewVals = Object.values(review);
    reviewVals = reviewVals.forEach((val) => {
      reviewsValues.push(val);
    });
  });

  REVIEWS_SCRIPT += REVIEWS_VALUES_SCRIPT;

  //console.log(REVIEWS_SCRIPT);

  // RATINGS SCRIPT
  var RATINGS_SCRIPT = `INSERT INTO ratings(id, reviewId, overall, quality, sizing, style, value, comfort) VALUES `;

  var RATINGS_VALUES_SCRIPT = data.ratings.map((rating) => {
    var ratingVals = Object.values(rating);
    ratingVals = ratingVals.map((val) => {
      return '?';
    });

    return `(${ratingVals.join(', ')})`;
  }).join(', ') + ';';


  var ratingsValues = [];

  data.ratings.forEach((rating) => {
    var ratingVals = Object.values(rating);
    ratingVals = ratingVals.forEach((val) => {
      ratingsValues.push(val);
    });
  });

  RATINGS_SCRIPT += RATINGS_VALUES_SCRIPT;

  return {
    reviews: REVIEWS_SCRIPT,
    reviewsValues,
    ratings: RATINGS_SCRIPT,
    ratingsValues
  };
}

// Setup Connection
const database = process.env.MYSQL_DB || 'tcreviews';

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST || 'localhost',
	user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: database,
  multipleStatements: true
});

// INSERT BULK DATA
// (Use sync method to avoid Error Timeout with Node + MySQL on large dataset)
db.connect(function(err) {
  if (err) {
    console.log('Seeding - Failed to connect', err);
  }

  var insertBatch = function(fromId, toId) {
    let scripts = getMysqlScripts(fromId, toId);
    //console.log(scripts.reviews);
    //console.log(scripts.reviewsValues);

    db.query(scripts.reviews, scripts.reviewsValues, function(err, rows, fields) {
      if (err) {
        console.log(`Seeding reviews error from ${fromId} to ${toId}`, err);
        return;
      }

      console.log(`Table reviews has been seeded successfully from ${fromId} to ${toId}`);

      db.query(scripts.ratings, scripts.ratingsValues, function(err, rows, fields) {
        if (err) {
          console.log(`Seeding ratings error from ${fromId} to ${toId}`, err);
          return;
        }

        console.log(`Table ratings has been seeded successfully from ${fromId} to ${toId}`);

        // If target size records reached, end process
        if (toId >= targetSize) {
          // end connection
          db.end();
        } else {
          // recursion on inserBatch for other IDs
          // ex: with batchSize of 1000
          // if it was insertBatch(1001, 2000)
          // it could be insertBatch(2001, 3000)
          insertBatch(toId + 1, toId + batchSize);
        }

      });
    });
  }

  insertBatch(1, batchSize);
});
