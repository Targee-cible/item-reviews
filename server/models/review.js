const mysql = require('../../mysql');
const neo4j = require('../../neo4j');

let driver = process.env.DB_DRIVER || 'mysql';
console.log('db driver', driver);

const LRUCache = require('lru-cache');
var cache = new LRUCache({
  max : 100,                   // The maximum number of items allowed in the cache
  max_age : 30 * 60 * 1000     // The maximum life of a cached item in milliseconds
});

module.exports.findFromProduct = (productId, limit = 20, callback) => {

  if (driver === 'mysql') {

    let cache_key = 'reviews:' + productId;

    let data = cache.get(cache_key);

    if (data) {
      callback(null, data);
      return;
    }

    var revScript =`
      SELECT *
      FROM reviews
      INNER JOIN ratings ON ratings.reviewId = reviews._id
      WHERE productId = ?
      ORDER BY reviews._id DESC
      LIMIT ?
    `;

    var summaryScript = `
      SELECT
      round(sum(rat.overall)/count(rev._id), 1) as overall,
      round(sum(rat.quality)/count(rev._id), 1) as quality,
      round(sum(rat.sizing)/count(rev._id), 1) as sizing,
      round(sum(rat.style)/count(rev._id), 1) as style,
      round(sum(rat.value)/count(rev._id), 1) as value,
      round(sum(rat.comfort)/count(rev._id), 1) as comfort,
      sum(rev.recommend = 1) as recommends,
      count(rev._id) as reviews
      FROM ratings as rat
      INNER JOIN reviews as rev ON rev._id = rat.reviewId
      WHERE productId = ?
    `;

    mysql.query(revScript, [productId, limit], (err, reviews) => {
      if (err) {
        callback(err);
        return;
      }

      // set rating fields as an object
      reviews.forEach(rev => {
        let rat = {
          overall: rev.overall,
          quality: rev.quality,
          sizing: rev.sizing,
          style: rev.style,
          value: rev.value,
          comfort: rev.comfort
        }

        rev.ratings = rat;

        delete rev.overall;
        delete rev.quality;
        delete rev.sizing;
        delete rev.style;
        delete rev.value;
        delete rev.comfort;
      })

      mysql.query(summaryScript, [productId], (err, results) => {
        if (err) {
          callback(err);
          return;
        }

        let data = { reviews, summary: results[0] };

        cache.set(cache_key, data);

        callback(null, data);
      });
    });

  } if (driver === 'neo4j') {

    var cypher = `
      MATCH (rev:Review)
      WHERE productId = ${productId}
      RETURN {
        _id: rev._id,
        title: rev.title,
        review: rev.review,
        customerName: rev.customerName,
        purchaseDate: rev.purchaseDate,
        productId: rev.productId,
        helpful: rev.helpful,
        recommend: rev.recommend,
        ratings: {
          overall: rev.overall,
          sizing: rev.sizing,
          style: rev.style,
          value: rev.value,
          comfort: rev.comfort,
          quality: rev.quality
        }
      }
      LIMIT ${limit}
    `;

    //ORDER BY rev._id DESC

    neo4j.run(cypher)
      .then(result => {
        result = result.records.map((rec) => {
          return rec._fields[0];
        });

        callback(null, result);
      })
      .catch(err => {
        callback(err);
      });
  }

};

module.exports.findOne = (id, callback) => {

};

module.exports.create = (review, callback) => {
  var ratingsValues = Object.values(review.ratings);
  delete review.ratings;
  var reviewsValues = Object.values(review);
  var values = reviewsValues.concat(ratingsValues);

  if (driver === 'mysql') {
    var script = `INSERT INTO reviews(title, review, customerName, purchaseDate, productId, helpful, recommend) VALUES (?, ?, ?, ?, ?, ?, ?);`;

    script += `INSERT INTO ratings(reviewId, overall, quality, sizing, style, value, comfort) VALUES (LAST_INSERT_ID(), ?, ?, ?, ?, ?, ?);`;

    mysql.query(script, values, function(err, rows, fields) {
      if (err) {
        console.log('Error creating review', err);
        callback(err);
        return;
      }

      // Get last Inserted Id to unshift it to ratings array
      console.log('Review and rating created successfully');
      callback(null, rows);
    });

  } else {
    // Neo4j or MongoDB
  }

};

module.exports.update = (id, data, callback) => {

};

module.exports.destroy = (id, callback) => {

};
