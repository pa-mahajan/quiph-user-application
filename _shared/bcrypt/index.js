'use strict'
let bcrypt = require('bcrypt-nodejs');

module.exports = bcrypt.genSaltSync;
module.exports = bcrypt.hashSync;
module.exports = bcrypt.compareSync;
module.exports.getRounds = bcrypt.getRounds;

module.exports.genSalt = function(rounds, ignore){
	return new Promise(function(resolve, reject){
		bcrypt.genSalt(rounds, function(err, salt){
			if(err)
				return reject(err);
			resolve(salt);
		});
	});
}

module.exports.hash = function(data, salt){
	return new Promise(function(resolve, reject){
		bcrypt.hash(data, salt, null, function(err, hash){
			if(err) 
				return reject(err);
			return resolve(hash);
		});
	});
}

module.exports.compare = function(data, hash){
	return new Promise(function(resolve, reject){
        bcrypt.compare(data, hash, function(err, matched){
			if(err)
				return reject(err)
			return resolve(matched);
		});
	});
}