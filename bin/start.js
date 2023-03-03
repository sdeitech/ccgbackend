'use strict'

require('@babel/register');
require('@babel/polyfill');

const app = require('../app').default;
const http = require('http');

require('dotenv/config');
process.env.NODE_ENV = process.env.NODE_ENV || "local"; //local
const config = require('../config/config.js').get(process.env.NODE_ENV);

const normalizePort = function (val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
};

const port = normalizePort(config.PORTS.API_PORT);

const server = http.createServer(app);


server.listen(port);

/**
 * Event listener for HTTP server "error" event.
 */
server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? `Pipe ${port}`
        : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            // debug(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            // debug(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
});


/**
 * Event listener for HTTP server "listening" event.
 */

server.on('listening', () => {
    console.log(`Listening on ${port}`);
});