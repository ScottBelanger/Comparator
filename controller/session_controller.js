var Session = function( user, sessionID, expires ) {
  if( user ) {
    this._user = user;
  } else { 
    this._user = null;
  }

  if( sessionID ) {
    this._sessionID = sessionID;
  } else {
    this._sessionID = null; // SessionID really isn't a session id, it's a hash
                            // of the user's username, so it does not differ
                            // between sesssions. It it to keep track of the user
                            // in the controller.
  }

  if( expires ) {
    this._expires = expires;
  } else {
    this._expires = new Date( Date.now() + 1000*60*60*2 ); // 2 hour
  }

  console.log( "Session Created:" );
  console.log( this );
};

var SessionController = function() {
  this._sessions = [];
  
  var cont = this;
  setInterval( function() {
    garbageCollection( cont )
  }, 1000*30 ); // 30 secs

  console.log( "SessionController Created:" );
  console.log( this );
};

SessionController.prototype.addSession = function( session ) {
  this._sessions.push( session );
};

SessionController.prototype.deleteSession = function( sessionID, sessionController, callback ) {
  sessionController._sessions.forEach( function( session, index ) {
    if( session._sessionID == sessionID ) {
      sessionController._sessions.splice( index, 1 );
    }
  });
};

SessionController.prototype.refreshSession = function( sessionID ) {
  this._sessions.forEach( function( session ) {
    if( session._sessionID == sessionID ) {
      session._expires = new Date(Date.now() + 1000*60*60*2); // 2 hours
    }
  });
};

var garbageCollection = function( sessionController ) {

  console.log( "Garbage Collection Running." );

  sessionController._sessions.forEach( function( session, index, array ) {
    if( session._expires < Date.now() ) {
      sessionController.deleteSession( session._sessionID, sessionController );
      console.log( "Object deleted" );
    }

  });

};

module.exports = { Session : Session,
                   SessionController : SessionController };
