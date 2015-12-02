var http = require('http');
var fs = require('fs');

var requestHandler = function(request, response) {
	var path;
	if(request.method == 'GET'){
		if(request.url == '/'){
			path = 'public/html/login.html';
		}
		else{
			path = '.'+request.url;
		}
		fs.readFile(path, function(err,data){
			if(data){
				response.end(data);
			}
			if(err){
				response.statusCode = 404;
				response.end('page not found');
			}
		});
	}
	if(request.method == 'POST'){
		var data = '';
		request.on('data',function(chunk){
			data += chunk;
		}).on('end',function(){});
	}
};

var server = http.createServer(requestHandler);
server.listen(1234);
