/**
 * PostgreSql Connection File
 */
'use strict'

const { Pool, Client } = require('pg'),
    config = require('./../environment');

/**
 * Create A pool of connections
 */
const pool = new Pool({
    user: config.connections.psql.user,
    host: config.connections.psql.host,
    database: config.connections.psql.database,
    password: config.connections.psql.password,
    port: config.connections.psql.port
});

/**
 * Export Connection Pool
 */
module.exports = pool;