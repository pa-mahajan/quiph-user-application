/**
 * Application Runner
 */
'use strict'

/**
 * Set Appplication Configurations
 */
let config = require('./config/environment');

/**
 * Initialize Logger accross application
 */
let logger = require(config.shared.logger);
logger.init(config);

/**
 * Require Logger
 */
const l = logger.root.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) });

/**
 * Uncaught Exception Handler
 */
process.on('uncaughtException', (err) => {
    l.error(err, 'Uncaught Exception');
});

/**
 * Uncaught Rejection Handler
 */
process.on('uncaughtRejection', (err) => {
    l.error(err, ' Uncaught Rejection ');
})

/**
 * Initailize Data Base Connections
 */
require('./config/connections')();

/**
 * koa Configuration
 */
const koa = require('koa'),
    app = new koa(),
    co = require('co'),
    router = require('koa-router');

/**
 * Application Middleware
 */
require('./middlewares')(app);

/**
 * Initialize Application Function
 */
app.init = co.wrap(async () => {
    l.info('Initializing Application');
    l.info('Initiating server on IP: %s at PORT: %d in  %s mode', config.ip, config.port, config.env);
    app.server = app.listen(config.port);
});

app.init();