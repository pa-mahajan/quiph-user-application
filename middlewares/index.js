/**
 * Application Middlewares
 */
'use strict'

let router = require('koa-router');

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
    for(let i=0; i<components.length; i++){
        require(path.join(__dirname, './../components', components[i])).init(params);
    }
    l.info('components Initialized');
}