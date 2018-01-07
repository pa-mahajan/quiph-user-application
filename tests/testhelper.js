/**
 * Test Helper File
 */

const mocha = require('mocha'),
    coMocha = require('co-mocha'),
    chai = require('chai');
    chaiThings = require('chai-things')

coMocha(mocha);
chai.use(chaiThings);
require('./../index');