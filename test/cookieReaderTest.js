var assert = require('chai').assert;
var reader = require('../lib/cookieReader');
describe('cookieReader',function(){
	it('reads a cookie when present in the request header',function(done){
		var req = {headers:{cookie:'userName=Ranju'}};
		var res;
		var next = function(){
			assert.deepEqual({userName:'Ranju'},req.Cookies);
			done();
		};
		reader.read(req,res,next);		
	}),
	it('reads two cookies when present in the request header',function(done){
		var req = {headers:{cookie:'userName=Ranju ;message=Hello'}};
		var res;
		var next = function(){
			assert.deepEqual({userName:'Ranju',message:'Hello'},req.Cookies);
			done();
		};
		reader.read(req,res,next);
	}),
	it('reads no cookies when absent in the request header',function(done){
		var req = {headers:{}};
		var res;
		var next = function(){
			assert.deepEqual({},req.Cookies);
			done();
		};
		reader.read(req,res,next);	
	})

})