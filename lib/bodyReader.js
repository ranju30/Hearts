var querystring = require('querystring');
exports.read = function(req,res,next){
	var content = '';
	req.on('data',function(text){
		content +=text.toString();		
	});
	req.on('end',function(){
		req.Body = querystring.parse(content);
		content='';
		next();
	});
};