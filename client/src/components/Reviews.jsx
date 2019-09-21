/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-underscore-dangle */
/* eslint react/prop-types: 0 */
import React from 'react';
import PropTypes from 'prop-types';


const Review = ({ review = {} }) => (
  <li className="card">
    <div>{review.title}</div>
    <div>{review.customerName}</div>
    <div>{review.purchaseDate}</div>
    <div>recommends: {review.recommend ? 'true' : 'false'}</div>
    <div>{review.review}</div>
  </li>
);
const Reviews = ({ reviews = [] }) => {
  const reviewsList = reviews.map((review) => <Review review={review} key={review._id} />);
  return (
    <div className="cards">
      <h3>Reviews</h3>
      <ul>
        {reviewsList}
      </ul>
    </div>
  );
};
Reviews.propTypes = {
  reviews: PropTypes.arrayOf(PropTypes.shape({
    review: PropTypes.string,
    _id: PropTypes.number,
  })).isRequired,
};
Review.propTypes = {
  review: PropTypes.shape({
    review: PropTypes.string,
    _id: PropTypes.number,
    customerName: PropTypes.string,
    title: PropTypes.string,
    purchaseDate: PropTypes.string,
    recommend: PropTypes.bool,

  }).isRequired,
};
export default Reviews;
