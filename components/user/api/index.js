/**
 * API Index File
 */
'use strict'

const userAPIController = require('./user.api.controller'),
    parse = require('koa-better-body'), 
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

    } catch(err){
        throw(err);
    }
}