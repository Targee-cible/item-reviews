/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
/* eslint react/prop-types: 0 */
import PropTypes from 'prop-types';

const Summary = ({ summary }) => (
  <div className="summary">
    <h3>Guest Ratings and Reviews </h3>
    <div className="reviews">
      # Reviews {summary.reviews}
    </div>
    <div className="recommend">
      <div>
        # Recommended: {summary.recommends}
      </div>
      Recommended by {Math.floor((summary.recommends / summary.reviews) * 100)}%
    </div>
    <div className="overall">
      Overall Rating {summary.overall}
    </div>
    <div className="quality">
      Quality: {summary.quality}
    </div>
    <div className="sizing">
      Sizing {summary.sizing}
    </div>
    <div className="value">
      Value: {summary.value}
    </div>
    <div className="comfort">
      Comfort: {summary.comfort}
    </div>
    <div className="style">
      Style: {summary.style}
    </div>
  </div>
);
Summary.propTypes = {
  summary: PropTypes.shape({
    reviews: PropTypes.string,
    recommends: PropTypes.string,
    overall: PropTypes.string,
    quality: PropTypes.string,
    sizing: PropTypes.string,
    style: PropTypes.string,
    value: PropTypes.string,
    comfort: PropTypes.string,
  }).isRequired,
};

export default Summary;
