require('../db/index.js');
const Reviews = require('../models/Reviews');

const sumRatings = (reviews) => reviews.reduce((acc, review) => {
  const keys = Object.keys(review.ratings);
  keys.forEach((key) => {
    if (!acc[key]) {
      acc[key] = review.ratings[key];
    } else {
      acc[key] += review.ratings[key];
    }
  });
  return acc;
}, {});

const getSummary = (reviews) => {
  const totalRecommends = reviews.filter((review) => review.recommend === true);
  const totals = sumRatings(reviews);
  const keys = Object.keys(totals);
  const summary = keys.reduce((acc, key) => {
    const temp = totals[key] / reviews.length;
    acc[key] = Number.parseFloat(temp).toFixed(1);
    return acc;
  }, {});
  delete summary.$init;
  Object.assign(summary, { recommends: totalRecommends.length, reviews: reviews.length });
  return summary;
};

const getReviews = (req, res) => {
  const { productId } = req.params;
  Reviews.find({ productId })
    .then((reviews) => {
      const results = {};
      results.summary = getSummary(reviews);
      results.reviews = reviews;
      res.status(200).json(results);
    })
    .catch((err) => res.status(404).send(err.message));
};

module.exports = getReviews;
