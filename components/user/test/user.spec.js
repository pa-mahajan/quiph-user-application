/**
 * User Test File
 */
'use strict'

console.log('test')
const user = require('./../'),
    should = require('chai').should;

describe('User', async () => {
    describe('Create New User', async () => {
        it('should validate required fields and return error');
        it('should return the new user id and info if information is validated');
        it('should not enter user with duplicate email id');
        it('should add user in database');
    });
})
