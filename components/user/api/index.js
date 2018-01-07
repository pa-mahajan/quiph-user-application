/**
 * API Index File
 */
'use strict'

const userAPIController = require('./user.api.controller'),
    parse = require('koa-better-body'), 
    authServices = require('./../../../auth'),
    convert = require('koa-convert');

exports.init = (params) => {
    try{
        
        /**
         * Get User API 
         */
        params.router.get('/', userAPIController.get);

        /**
         * Create User API
         */
        params.router.post('/', convert(parse()), userAPIController.create);

        /**
         * Update User API
         */
        params.router.put('/:id', convert(parse()), userAPIController.update);
        
        /**
         * Delet User API
         */
        params.router.del('/:id', userAPIController.remove);

        /**
         * Authenticate User
         */
        params.router.post('/auth', convert(parse()), userAPIController.authenticate);

        /**
         * Get Logged In user Details
         */
        params.router.get('/me', authServices.isAuthenticated(), userAPIController.me);
    } catch(err){
        throw(err);
    }
}