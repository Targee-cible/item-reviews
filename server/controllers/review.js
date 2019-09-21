const Review = require('../models/review');

const create = (req, res, next) => {
  var reviewData = req.body;

  Review.create(reviewData, (err, data) => {
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

  Review.findFromProduct(pId, 20, (err, results) => {
    if (err) {
      console.log('error fetching product reviews', err);
      res.status(400).json({ success: false, message: 'Could not fetch product reviews from our Database' });
    } else {
      res.status(200).json(results);
    }
  });
};

const findOne = (req, res, next) => {
  var id = req.params.id;

  Review.findOne(id, (err, review) => {
    if (err) {
      console.log('error fetching review', err);
      res.status(400).json({ success: false, message: 'Could not fetch review from our Database' });
    } else {
      res.status(200).json(review);
    }
  });
};

const update = (req, res, next) => {
  var id = req.params.id;
  var reviewData = req.body;

  Review.update(id, reviewData, (err, result) => {
    if (err) {
      console.log('update error', err);
      res.status(400).json({ success: false, message: 'Could not update review in our Database' });
    } else {
      res.status(200).json({success: true});
    }
  });
};

const destroy = (req, res, next) => {
  var id = req.params.id;

  Review.destroy(id, (err, results) => {
    if (err) {
      console.log('error deleting review', err);
      res.status(400).json({ success: false, message: 'Could not delete review from our Database' });
    } else {
      res.status(200).json({success: true});
    }
  });
};


module.exports = {
  create,
  findFromProduct,
  findOne,
  update,
  destroy
};
