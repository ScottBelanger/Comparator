// ===== Module imports =====
var mysql = require('mysql');

/*
 * compardb Connection
 *
 * Description: Connection configuration object for connection 
 *              to comparator mysql database hosted on AWS.
 */
var connection = mysql.createConnection({
  host     : 'capstonedb.ce5v1pz5vg4e.us-east-1.rds.amazonaws.com',
  user     : 'capstone',
  password : 'capstone',
  database : 'compardb', 
  ssl      : 'Amazon RDS'
});

module.exports = connection;
