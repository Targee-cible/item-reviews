require('dotenv').config();
const session = require('./');
const fs = require('fs');

let filesCount = 100;
let batchSize = 100000;

// Recursive function to create batch insertion
// Return a Promise
const runCreateCypher = (counter) => {

  let csvFile = `file:///Users/Keitel/repos/targee-cible/item-reviews/public/review-${batchSize}-${counter}.csv`;

  let createCypher = `
    USING PERIODIC COMMIT 500
    LOAD CSV WITH HEADERS FROM '${csvFile}' AS row
    CREATE (rev:Review {_id: toInteger(row._id), title: row.title, review: row.review, customerName: row.customerName, purchaseDate: row.purchaseDate, productId: toInteger(row.productId), helpful: row.helpful, recommended: row.recommended, overall: toInteger(row.overall), quality: toInteger(row.quality), sizing: toInteger(row.sizing), style: toInteger(row.style), value: toInteger(row.value), comfort: toInteger(row.comfort)}) RETURN count(rev)
  `;

  return session.run(createCypher)
    .then(result => {

      console.log(`Table Review and Rating has been seeded successfully from csv file #${counter}`);

      // If target size records reached, end process
      if (counter < filesCount - 1) {
        // recursion on runCreateCypher for other IDs
        return runCreateCypher(counter + 1);
      }
    });
}

// delete data first
let deleteCypher = 'MATCH (n) DETACH DELETE n';

session.run(deleteCypher)
  .then(result => {
    console.log(result);
    return runCreateCypher(0);
  })
  .then(result => {
    console.log(result);
    `Table Review has been seeded successfully with ${batchSize * filesCount} records`
    session.close();
  })
  .catch(err => {
    console.log('error', err);
  });


