/* eslint-disable no-console */
import React from 'react';
// use axios instead to fetch reviews via API
import axios from 'axios';

import Summary from './Summary';
import Filters from './Filters';
import Reviews from './Reviews';

// remove old client code that fetch reviews directly from MongoDB
// instead of API call
// import GetReviews from '../controllers';


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      reviews: [],
      summary: {},
    };
    this.getReviews.bind(this);
  }

  componentDidMount() {
    this.getReviews();
  }

  /* async getReviews() {
    try {
      const response = await GetReviews();
      if (response !== undefined) {
        const { reviews, summary } = response.data;
        this.setState({
          loading: false,
          reviews,
          summary,
        });
      }
    } catch (err) { console.log('error', err); }
  } */

  getReviews() {
    axios.get('/api/product/1/reviews')
      .then((response) => {
        const { reviews, summary } = response.data;
        this.setState({
          loading: false,
          reviews,
          summary,
        });
      });
  }


  render() {
    const {
      loading, reviews, summary,
    } = this.state;
    if (loading) return <div>Loading...</div>;
    return (
      <div className="reviews">
        <Summary summary={summary} />
        <Filters />
        <Reviews reviews={reviews} />
      </div>
    );
  }
}

export default App;
