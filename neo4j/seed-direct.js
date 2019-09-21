require('dotenv').config();
const session = require('./');
const generator = require('./../data/reviews.js');

// Generate a batch of N data and insert N records at once in MySQL Database
// Do Recursion until we reach the target size of 10M
//let targetSize = 10 * 1000 * 1000;
//let batchSize = 10 * 1000;
let targetSize = 200 * 1000;
let batchSize = 250;

// generate data once. then add batchSize to id each time
const data = generator.generateReviewsAndRatings(1, batchSize);

var getNeo4jCypher = (fromId) => {

  // REVIEWS & RATINGS SCRIPT
  let CREATE_SCRIPT = 'CREATE ';

  // Prepare relation cypher part
  //(rev1)-[:RATE]->(rat1),
  //(rev2)-[:RATE]->(rat2)
  let relScript = '';

  // Review cypher part
  // (rev1:Review { title: "Nice Product", review: "My Review" }),
  let reviews = data.reviews.map((review, ind) => {
    // Prepare relation cypher part here to avoid looping twice
    relScript += `(rev${review.id})-[:RATE]->(rat${review.id})`;
    if (ind < data.reviews.length - 1) {
      relScript += ',';
    }

    let script = `{
      _id: ${review.id + fromId - 1},
      title: "${review.title}",
      review: "${review.review}",
      customerName: "${review.customerName}",
      purchaseDate: "${review.purchaseDate}",
      productId: ${review.productId},
      helpful: "${review.helpful}",
      recommend: "${review.recommend}"
    }`;

    return `(rev${review.id}:Review ${script})`;
  }).join(', ');

  // Rating cypher part
  // (rat1:Rating { overall: 4, quality: 5 }),
  let ratings = data.ratings.map((rating) => {
    let script = `{
      overall: ${rating.overall},
      quality: ${rating.quality},
      sizing: ${rating.sizing},
      style: ${rating.style},
      value: ${rating.value},
      comfort: ${rating.comfort}
    }`;

    return `(rat${rating.id}:Rating ${script})`;
  }).join(', ');

  CREATE_SCRIPT += reviews + ', ' + ratings + ', ' + relScript;

  return CREATE_SCRIPT;
}



// Recursive function to create batch insertion
// Return a Promise
const runCreateCypher = (fromId) => {
  let createCypher = getNeo4jCypher(fromId);

  return session.run(createCypher)
    .then(result => {

      if ((fromId + batchSize - 1) % 1000 === 0) {
        console.log(`Tables Review and Rating has been seeded successfully from ${fromId} to ${fromId + batchSize - 1}`);
      }

      // If target size records reached, end process
      if ((fromId + batchSize - 1) < targetSize) {
        // recursion on runCreateCypher for other IDs
        // ex: with batchSize of 1000
        // if it was runCreateCypher(1001, 2000)
        // it could be runCreateCypher(2001, 3000)
        return runCreateCypher(fromId + batchSize);
      }
    });
}


// delete data first
//let deleteCypher = 'MATCH (n) DETACH DELETE n';
let deleteCypher = 'RETURN "continue"';

session.run(deleteCypher)
  .then(result => {
    console.log(result);
    return runCreateCypher(150001);
  })
  .then(result => {
    console.log(result);
    `Tables Review and Rating has been seeded successfully with ${targetSize} records`
    session.close();
  })
  .catch(err => {
    console.log('error', err);
  });
