var fs = require('fs');
var querystring = require('querystring');
var _ = require('lodash');
var cookieReader = require('./lib/cookieReader');
var bodyReader = require('./lib/bodyReader');
var Games = require('./lib/games');
var games = new Games();

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
	var name = req.Body.userName;
	games.ensureJoin(name);
	res.setHeader("Set-Cookie", ["userName="+name]);
	redirectTo(res,'game.html');
};


var sendJSON = function(res,data){
	res.setHeader('Content-type','application/javascript');
	res.end(JSON.stringify(data));
};

var getGameStatus = function(req,res){
	res.end(JSON.stringify(req.game.getStatus(req.User.name)));
};

var playerLogout = function(req, res){
	// if(req.User && setup)
	// 	setup.leave(req.User.name);
	res.setHeader("Set-Cookie", '');
	redirectTo(res,'login.html');	
};

var serveIndex = function(req, res){
	if(req.User)
		redirectTo(res,'game.html');
	else
		redirectTo(res,'login.html');
};
//TODO: name should not be empty
var ensureLoggedIn = function(req,res,next){
	if(req.User)
			next();
	else
		redirectTo(res,'login.html');
};

var informUnauthorizedIfNotLoggedIn = function(req,res,next){
	if(req.User)
			next();
	else{
		res.statusCode = 401;
		res.end();
	}
};

var ensureGameOn = function(req, res, next){
	games.ensureJoin(req.User.name);
	req.game = games.findByPlayer(req.User.name);
	next();
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
	var user = {name:name};
	req.User = name && user;
	//(setup && setup.exists(name) )||( game && game.exists(name)) && user;
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
	{path: '^/game.html$', handler: ensureLoggedIn},
	{path: '^/game.html$', handler: ensureGameOn},
	{path: '^/gameStatus$', handler: ensureLoggedIn},
	{path: '^/gameStatus$', handler: ensureGameOn},
	{path: '^/gameStatus$', handler: getGameStatus},
	{path: '', handler: serveStaticFile},
	{path: '', handler: fileNotFound}
];
exports.games = games;
