var neo4j = require('neo4j-driver').v1;
require('dotenv').config();
const generator = require('./../data/reviews.js');

var protocol = process.env.NEO4J_PROTOCOL || 'bolt';
var host = process.env.NEO4J_HOST || 'localhost';
var user = process.env.NEO4J_USERNAME || 'neo4j';
var password = process.env.NEO4J_PASSWORD || 'neo4j';
var database = process.env.NEO4J_DB || 'tcreviews';


//console.log(protocol, host, user, password);

var driver = neo4j.driver(
  `${protocol}://${host}`,
  neo4j.auth.basic(user, password)
);

const session = driver.session(neo4j.session.READ);

// Generate a batch of N data and insert N records at once in MySQL Database
// Do Recursion until we reach the target size of 10M
//let targetSize = 10 * 1000 * 1000;
//let batchSize = 10 * 1000;
let targetSize = 1 * 1000 * 1000;
let batchSize = 250;

var getNeo4jCypher = (fromId, toId) => {
  const data = generator.generateReviewsAndRatings(fromId, toId);
  let reviews = data.reviews;
  let ratings = data.ratings;

  // REVIEWS & RATINGS SCRIPT
  let CREATE_SCRIPT = 'CREATE ';

  // Prepare relation cypher part
  //(rev1)-[:RATE]->(rat1),
  //(rev2)-[:RATE]->(rat2)
  let relScript = '';

  // Review cypher part
  // (rev1:Review { title: "Nice Product", review: "My Review" }),
  reviews = reviews.map((review, ind) => {
    // Prepare relation cypher part here to avoid looping twice
    relScript += `(rev${review.id})-[:RATE]->(rat${review.id})`;
    if (ind < reviews.length - 1) {
      relScript += ',';
    }

    let script = `{
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
  ratings = ratings.map((rating) => {
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
const runCreateCypher = (fromId, toId) => {
  let createCypher = getNeo4jCypher(fromId, toId);

  return session.run(createCypher)
    .then(result => {

      if (toId % 1000 === 0) {
        console.log(`Tables Review and Rating has been seeded successfully from ${fromId} to ${toId}`);
      }

      // If target size records reached, end process
      if (toId < targetSize) {
        // recursion on runCreateCypher for other IDs
        // ex: with batchSize of 1000
        // if it was runCreateCypher(1001, 2000)
        // it could be runCreateCypher(2001, 3000)
        return runCreateCypher(toId + 1, toId + batchSize);
      }
    });
}


// delete data first
let deleteCypher = 'MATCH (n) DETACH DELETE n';

session.run(deleteCypher)
  .then(result => {
    console.log(result);
    return runCreateCypher(1, batchSize);
  })
  .then(result => {
    console.log(result);
    `Tables Review and Rating has been seeded successfully with ${targetSize} records`
    session.close()
  })
  .catch(err => {
    console.log('error', err);
  });
