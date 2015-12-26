var http = require('http');
var controller = require('./lib/controller');
http.createServer(controller).listen(3011);
console.log('Server running on port 3011');