/**
 * Beta Environment Configurations
 */
'use strict'

module.exports = {
    log: {
        level: 'debug',
        count: 3,
        period: '1d'
    },
    connections: {
        psql:{
            user: "parth",
            host: "127.0.0.1",
            database: "quiph-user-app",
            password: 12345678,
            port: 5433,
            connect: true
        }
    }
}