var express = require('express');
var app = express();

app.get('/', function(req, res) {
   res.writeHead(200);
   res.write("Hello World!");
   res.end();
});

app.listen(3000, function() {
   console.log('Listening on port 3000!');
})
