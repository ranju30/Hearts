var http = require('http');
var requestHandler = require('requestHandler');
http.createServer(requestHandler).listen(3011);
console.log('Server running on port 3011');