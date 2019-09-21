/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
/* eslint react/prop-types: 0 */
import PropTypes from 'prop-types';
import ReactMinimalPieChart from 'react-minimal-pie-chart';
import Rater from 'react-rater';
import 'react-rater/lib/react-rater.css';

const Charts = ({ chart }) => {
  const key = Object.keys(chart);
  const value = Object.values(chart);
  return (
    <div className="chartSections">
      <ReactMinimalPieChart
        data={[{
          value: parseFloat(value, 10),
          color: '#00A200',
        }]}
        totalValue={5}
        lineWidth={10}
        label
        labelStyle={{
          fontSize: '36px',
          fontWeight: 'bold',
        }}
        labelPosition={0}
        background="#f7f7f7"
        className="chart"
      />
      <div className="text">{key} out of 5</div>
    </div>
  );
};

const Summary = ({ summary }) => {
  const {
    reviews, recommends, overall, quality, sizing, comfort, style, value,
  } = summary;

  const qual = { quality: parseFloat(quality, 10) };
  const size = { sizing: parseFloat(sizing, 10) };
  const comf = { comfort: parseFloat(comfort, 10) };
  const styl = { style: parseFloat(style, 10) };
  const val = { value: parseFloat(value, 10) };
  const properties = [];
  properties.push(qual, size, comf, styl, val);

  // eslint-disable-next-line react/no-array-index-key
  const chartList = properties.map((item, idx) => <Charts chart={item} key={idx} />);
  return (
    <div className="summary">
      <div className="title bold">Guest Ratings & Reviews </div>
      <div className="topsection">
        <div className="overall">
          <div className="ranking bold">{overall}</div>
          <Rater total={5} rating={parseFloat(overall, 10)} interactive={false} />
        </div>
        <div className="recommend">
          <div className="chart">
            <ReactMinimalPieChart
              data={[{
                value: Math.floor((recommends / reviews) * 100),
                color: '#00A200',
              }]}
              totalValue={100}
              lineWidth={10}
              label
              labelStyle={{
                fontSize: '36px',
                fontWeight: 'bold',
              }}
              labelPosition={0}
              background="#f7f7f7"
            />
          </div>
          <div className="bold">
            {Math.floor((recommends / reviews) * 100)}% would recommend
          </div>
        </div>
      </div>
      <div className="ratingsbar">
        {chartList}
      </div>
    </div>
  );
};
Summary.propTypes = {
  summary: PropTypes.shape({
    reviews: PropTypes.number,
    recommends: PropTypes.number,
    overall: PropTypes.number,
    quality: PropTypes.number,
    sizing: PropTypes.number,
    style: PropTypes.number,
    value: PropTypes.number,
    comfort: PropTypes.number,
  }).isRequired,
};

export default Summary;
