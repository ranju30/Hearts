exports.read = function(req,res,next){
	//name=Ranju; session=Ranju_1
	var readACookie = function(result,cookieText){
		var parts = cookieText.trim().split('=');
		result[parts[0]] = parts[1];
		return result;
	};
	req.Cookies = req.headers.cookie ? req.headers.cookie.split(';').reduce(readACookie,{}): {};
	console.log('cookies',req.Cookies);
	next();
};
	