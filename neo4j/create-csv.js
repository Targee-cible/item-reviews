require('dotenv').config();
const session = require('./');
const generator = require('./../data/reviews.js');
const fs = require('fs');

let filesCount = 100;
let batchSize = 100000;

// generate data once. then add batchSize to id each time
const data = generator.generateReviewsAndRatings(1, batchSize);

for (var i = 0; i < filesCount; i++) {
  let csv = '_id,title,review,customerName,purchaseDate,productId,helpful,recommended,overall,quality,sizing,style,value,comfort\n';

  csv += data.reviews.map((review, ind) => {
    review.id = (batchSize * i) + ind + 1;
    review.overall = data.ratings[ind].overall;
    review.quality = data.ratings[ind].quality;
    review.sizing = data.ratings[ind].sizing;
    review.style = data.ratings[ind].style;
    review.value = data.ratings[ind].value;
    review.comfort = data.ratings[ind].comfort;

    return Object.values(review).join(',');
  }).join('\n');

  //console.log('csv', csv);

  fs.writeFileSync(__dirname + `/../public/review-${batchSize}-${i}.csv`, csv);
}
