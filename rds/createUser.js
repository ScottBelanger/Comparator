var connection = require( './connection' );

var createUser = function( username, email, password, callback ) {

  var SQLquery = "INSERT INTO User SET ?";
  var insert = { Username: username, Password: password, Email: email };
    
  connection.query( SQLquery, insert, function( err, result ) {

    if( err ) {

      console.log( err );
      throw err;

    } else {

      callback( err, result );

    }

  });

};

module.exports = createUser;
