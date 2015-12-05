var assert = require('chai').assert;
var EventEmitter = require('events').EventEmitter;
var reader = require('../lib/bodyReader');
describe('bodyReader',function(){
	it('reads a parameter when present in the request body',function(done){
		var req = new EventEmitter(),res;
		var next = function(){
			assert.deepEqual({userName:'Ranju'},req.Body);
			done();
		};
		reader.read(req,res,next);
		req.emit('data','userName=Ranju');
		req.emit('end');
	}),
	it('reads two lines when present in the request body',function(done){
		var req = new EventEmitter(),res;
		var next = function(){
			assert.deepEqual({userName:'Ranju',message:'Hello'},req.Body);
			done();
		};
		reader.read(req,res,next);
		req.emit('data','userName=Ranju');
		req.emit('data','&message=Hello');
		req.emit('end');
	}),
	it('reads no parameters when absent in the request body',function(done){
		var req = new EventEmitter(),res;
		var next = function(){
			assert.deepEqual({},req.Body);
			done();
		};
		reader.read(req,res,next);
		req.emit('end');
	})
})