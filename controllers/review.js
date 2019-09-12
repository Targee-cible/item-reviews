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
  const productId = getProductId(req);
  console.log('productid', productId);
  Reviews.find({ productId })
    .then((reviews) => {
      const results = {};
      results.summary = getSummary(reviews);
      results.reviews = reviews;
      res.status(200).json(results);
    })
    .catch((err) => res.status(404).send(err.message));
};


const create = (req, res, next) => {
  var reviewData = req.body;

  Reviews.create(reviewData, (err, data) => {
    if (err) {
      console.log('create error', err);
      res.status(400).json({ success: false, message: 'Could not save review to Database' });
      return;
    } else {
      res.status(201).json({success: true});
    }
  });

};

const findFromProduct = (req, res, next) => {
  var pId = req.params.productId;

  Reviews.find({ productId: pId }, (err, reviews) => {
    if (err) {
      console.log('error fetching product reviews', err);
      res.status(400).json({ success: false, message: 'Could not fetch product reviews from our Database' });
    } else {
      const results = {};
      results.summary = getSummary(reviews);
      results.reviews = reviews;
      res.status(200).json(results);
    }
  });
};

const findOne = (req, res, next) => {
  var id = req.params.id;

  Reviews.findOne({ _id: id }, (err, review) => {
    if (err) {
      console.log('error fetching review', err);
      res.status(400).json({ success: false, message: 'Could not fetch review from our Database' });
    } else {
      res.status(200).json(review);
    }
  });
};

const update = (req, res, next) => {

};

const destroy = (req, res, next) => {

};


module.exports = {
  create,
  findFromProduct,
  findOne,
  update,
  destroy
};
