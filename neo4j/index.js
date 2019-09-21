var neo4j = require('neo4j-driver').v1;

var protocol = process.env.NEO4J_PROTOCOL || 'bolt';
var host = process.env.NEO4J_HOST || 'localhost';
var user = process.env.NEO4J_USERNAME || 'neo4j';
var password = process.env.NEO4J_PASSWORD || 'neo4j';
var database = process.env.NEO4J_DB || 'tcreviews';


//console.log(protocol, host, user, password);

var driver = neo4j.driver(
  `${protocol}://${host}`,
  neo4j.auth.basic(user, password),
  { disableLosslessIntegers: true }
);

const session = driver.session(neo4j.session.WRITE);

module.exports = session;