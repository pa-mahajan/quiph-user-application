/**
 * POstgreSQL Services
 */
'use strict'

const pool = require('./../../config/connections/psql.connection');

module.exports = {
    query: async (text, value) => {
        return await pool.query(text, value); 
    }, client: async () => {
        return await pool.connect();
    }
}