var assert = require('chai').assert;
var reader = require('../lib/cookieReader');
describe('cookieReader',function(){
	it('reads a cookie when present in the request header',function(){
		var req = {headers:{cookie:'userName=Ranju'}};
		reader.read(req);
		assert.deepEqual({userName:'Ranju'},req.Cookies);
	}),
	it('reads two cookies when present in the request header',function(){
		var req = {headers:{cookie:'userName=Ranju ;message=Hello'}};
		reader.read(req);		
		assert.deepEqual({userName:'Ranju',message:'Hello'},req.Cookies);
	}),
	it('reads no cookies when absent in the request header',function(){
		var req = {headers:{}};
		reader.read(req);		
		assert.deepEqual({},req.Cookies);
	})

})