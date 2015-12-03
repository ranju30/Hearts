var fs = require('fs');
const DATA_FILE = './data/playersName.json';
var names = fs.existsSync(DATA_FILE) && JSON.parse(fs.readFileSync(DATA_FILE,'utf8')) || [];

exports.add = function(entry){
	names.unshift(entry);
	save();
};

var save = function(){
	fs.writeFile(DATA_FILE, JSON.stringify(names), function(err){});
};

exports.getAll = function(){
	return names;
};
