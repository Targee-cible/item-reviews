const Promise = require('bluebird');

const sql = `
  DROP TABLE tcreviews IF EXISTS
`

module.exports = (db) => {
  if (!db.queryAsync) {
    db = Promise.promisifyAll(db);
  }
  // Create Database and tables
  return db.queryAsync(`
    `)
    .then(() => {
      console.log('Database structure created successfully')
    })
    .error(err => {
      console.log('migration error', err);
    });
};
