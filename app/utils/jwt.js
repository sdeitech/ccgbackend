// const expressJwt = require('express-jwt');
const config = process.env;
const { success, error, validation } = require('./restResponse');
const jwt1 = require('jsonwebtoken');
const moment = require('moment');
const constants = require('../assets/constants');
const setting = require('../assets/setting');

function jwt(req, res, next) {
    const secret = config.JWT_SECRET;
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        if (token) {
            jwt1.verify(token, secret, (err, user) => {
                if (err) {
                    let error1 = [];
                    error1.push('Invalid Token');
                    // jwt authentication error
                    return res.status(401).send(error(error1, 401));
                }
                req.master_id = user.master_id;
                next();
            })
        } else {
            return res.status(401).send(error('Token must be provided!', 401));
        }
    } else {
        return res.status(401).send(error('You are not authorized!', 401));
    }
}

function errorHandler(err, req, res, next) {
    if (typeof err != "undefined") {
        if (typeof (err) === 'string') {
            // custom application error
            return res.send(error(err));
        }

        if (err.name === 'UnauthorizedError') {
            let error1 = [];
            error1.push('Invalid Token');
            // jwt authentication error
            return res.status(401).send(error(error1, 401));
        }
    }


    // default to 500 server error
    return res.send(error(err.message));
}

module.exports = {
    jwt,
    errorHandler   
}