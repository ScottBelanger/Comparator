var mysql = require('mysql');

// Create connection with compardb configuration.
// TODO: Should change this to use connection pooling.
var connection = mysql.createConnection({
  host     : 'capstonedb.ce5v1pz5vg4e.us-east-1.rds.amazonaws.com',
  user     : 'capstone',
  password : 'capstone',
  database : 'compardb', 
  ssl      : 'Amazon RDS'
});

module.exports = connection;