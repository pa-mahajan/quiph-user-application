/**
 * Application Logger
 */
'use strict';

const b = require('bunyan'),
    path = require('path');

/**
 * Overiding logger close function
 */
b.prototype.close = function (f) {
    if (!this._isSimpleChild) {
        this.streams.forEach(function (s) {
            if (s.closeOnExit) {
                console.log('closing stream s:', s);
                s.stream.end(f);
                s.closeOnExit = false;
            }
        });
    }
};

/**
 * Logger Exports Object
 */
let lm = module.exports = {};

/**
 * Logger Initiating function
 */
lm.init = (config) => {
    let opts = {
        name: 'root',
        serializers: { // Logger Serializers
            err: b.stdSerializers.err,
            req: b.stdSerializers.req,
            res: b.stdSerializers.res,
            user: function (u) {
                if (u)
                    return u._id;
            }
        },
        streams: [
            {
                type: config.log.type,
                path: config.log.path,
                count: config.log.count, // Number of total files to be kept
                period: config.log.period, // Time period after which file should be changed
                level: config.log.level // logging  level
            }
        ]
    }
    if(config.env == 'development'){
        opts.streams.push({
            level: config.log.level,
            stream: process.stdout
        })
    }
    lm.root = b.createLogger(opts);
};