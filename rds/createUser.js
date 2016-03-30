var connection = require( './connection' );
var User       = require( '../models/user' );

var createUser = function( username, email, password, callback ) {

  var SQLquery = "INSERT INTO User SET ?";
  var insert = { Username: username, Password: password, Email: email };
    
  connection.getConnection(function(err, connection) {
    connection.query( SQLquery, insert, function( err, result ) {

      if( err ) {

        console.log( err );
        throw err;

      } else {
        connection.release();

            // User created in DB
            
            var user = new User();
            user.setId(result.insertId);
            user.setUserName(username);
            user.setPassword(password);
            user.setEmail(email);
        callback( err, user );

      }

    });
  });

};

module.exports = createUser;
