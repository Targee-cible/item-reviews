require('../db/index.js');
const Reviews = require('../models/Reviews');


const create = (req, res, next) => {
  var reviewData = req.body;

  Reviews.create(reviewData, (err, data) => {
    if (err) {
      console.log('create error', err);
      return;
    }

    res.status(201).send({success: true});
  });

};

const findFromProduct = (req, res, next) => {

};

const findOne = (req, res, next) => {

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
