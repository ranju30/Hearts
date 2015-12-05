var fs = require('fs');
var ld = require('lodash');
var cookieReader = require('./lib/cookieReader');
var bodyReader = require('./lib/bodyReader');
var querystring = require('querystring');

var method_not_allowed = function(req, res){
	res.statusCode = 405;
	console.log(res.statusCode);
	res.end('Method is not allowed');
};
var fileNotFound = function(req, res){
	res.statusCode = 404;
	res.end('Not Found');
};

var redirectTo = function(res,url){
	res.writeHead(302,{'Location':url});
	res.end();
};
var playerLogin = function(req, res){
	console.log('body',req.Body);
	res.setHeader("Set-Cookie", ["userName="+req.Body.userName]);
	redirectTo(res,'game.html');	
};
var playerLogout = function(req, res){
	res.setHeader("Set-Cookie", []);
	redirectTo(res,'login.html');	
};

var serveIndex = function(req, res){
	if(req.user)
		redirectTo(res,'game.html');
	else
		redirectTo(res,'login.html');
};

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

var loadUser = function(req,res,next){
	var name = req.Cookies.userName;
	req.user = name?{name:name}:null;
	next();
};

exports.post_handlers = [
	{path: '', handler: cookieReader.read},
	{path: '', handler: loadUser},
	{path: '', handler: bodyReader.read},
	{path: '^/login$', handler: playerLogin},
	{path: '', handler: method_not_allowed}
];
exports.get_handlers = [
	{path: '', handler: cookieReader.read},
	{path: '', handler: loadUser},
	{path: '^/$', handler: serveIndex},
	{path: '^/logout$', handler: playerLogout},
	{path: '', handler: serveStaticFile},
	{path: '', handler: fileNotFound}
];
