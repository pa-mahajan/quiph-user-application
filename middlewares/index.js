/**
 * Application Middlewares
 */
'use strict'

let router = require('koa-router'),
    config = require('./../config/environment'),
    l = require(config.shared.logger).root.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) }),
    fs = require('fs'),
    path = require('path');

module.exports = (app) => {

    l.info('Initializing Application Routes');
    let appRouter = new router(app);
    let params = {
        router: appRouter
    }
    initialize_application_components(params);
    app.use(appRouter.routes());
}

/**
 * Initialize Components Function
 * @param {*} params 
 */
let initialize_application_components = (params) => {
    l.info('Initializing Components');
    let components = fs.readdirSync(path.join(__dirname, './../components'));
    for (let i = 0; i < components.length; i++) {
        require(path.join(__dirname, './../components', components[i])).init(params);
    }
    l.info('components Initialized');
}