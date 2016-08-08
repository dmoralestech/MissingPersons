/**
 * Created by psenger on 1/08/2016.
 */

var User = require('../models/user'),
    NotFoundError = require('restify').errors.NotFoundError,
    BadRequestError = require('restify').errors.BadRequestError;

module.exports = function ( server, passport ) {

    server.post('/login', passport.authenticate('jwt', { successRedirect: '/',  failureRedirect: '/login' }));

    return server;
};