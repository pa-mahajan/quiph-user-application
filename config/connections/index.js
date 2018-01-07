/**
 * Connections File Handler
 */
'use strict'

const config = require('./../environment'),
    l = require(config.shared.logger).root.child({ 'module': __filename.substring(__dirname.length + 1, __filename.length - 3) });


module.exports = () => {
    /**
     * Possible Connections
     */
    const connections = [
        'psql'
    ];
    for(let i=0; i< connections.length; i++){
        if(config.connections[connections[i]].connect){
            l.info('Connecting To ', connections[i]);
            require('./' + connections[i] + '.connection').connect();
        }
    }
}