var fs = require('fs');
var ld = require('lodash');
var cookieReader = require('./lib/cookieReader');
var bodyReader = require('./lib/bodyReader');
var querystring = require('querystring');
var names = require('./name.js');

var method_not_allowed = function(req, res){
	res.statusCode = 405;
	console.log(res.statusCode);
	res.end('Method is not allowed');
};
var fileNotFound = function(req, res){
	res.statusCode = 404;
	res.end('Not Found');
};

var getNames = function(req,res){
	res.end(JSON.stringify(names.getAll()));
};

var joinPlayer = function(req, res){
	var data='';
	req.on('data',function(chunk){
    		data+=new Buffer(chunk, 'base64').toString('ascii');
    	});
	req.on('end',function(){
		
		res.writeHead(302,{
    		'Location':'/game.html',
    		'Content-Type':'text/html',
    	});
		var entry = querystring.parse(data);
		names.add(entry);
		getNames(req,res);
	});
};

var serveIndex = function(req, res, next){
	req.url = '/login.html';
	next();

};

var readCookies = function(req, res, next){
	cookieReader.read(req);
	console.log('cookies',req.Cookies);
	next();
};

var readBody = function(req, res, next){
	bodyReader.read(req);
	console.log('body',req.Body);
	next();
}

var serveStaticFile = function(req, res, next){
	var filePath = './public' + req.url;
	fs.readFile(filePath, function(err, data){
		if(data){
			res.statusCode = 200;
			console.log(res.statusCode);
			res.end(data);
		}
		else{
			next();
		}
	});
};

exports.post_handlers = [
	{path: '', handler: readCookies},
	{path: '', handler: readBody},
	{path: '^/login$', handler: joinPlayer},
	{path: '', handler: method_not_allowed}
];
exports.get_handlers = [
	{path: '', handler: readCookies},
	{path: '^/$', handler: serveIndex},
	{path: '', handler: serveStaticFile},
	{path: '', handler: fileNotFound}
];
