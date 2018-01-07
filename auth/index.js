/**
 * Application Auth Service
 */
'use strict'

const jsonwebtoken = require('jsonwebtoken'),
    config = require('./../config/environment'),
    l = require(config.shared.logger).root.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }),
    jwt = require('koa-jwt');

let isAuthenticated = function(ctx, next) {
    return jwt({ secret: config.secrets.session, algorithms: ['HS256']});
}
    
let signToken = function(payload){
	try{
		return jsonwebtoken.sign(payload, config.secrets.session);
	} catch(err){
		l.error('File: Auth.Service, Service --> SignToken, Error --> ', err);
		throw(err);
	}
}

module.exports = {
    signToken: signToken,
    isAuthenticated: isAuthenticated
}