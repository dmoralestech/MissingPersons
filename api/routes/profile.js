/**
 * Created by psenger on 31/07/2016.
 */
var User = require('../models/user'),
    NotFoundError = require('restify').errors.NotFoundError,
    BadRequestError = require('restify').errors.BadRequestError;

let getProfileBuId = function getProfileBuId ( req, res, next ){

};

module.exports = function ( server ) {


    // server.get('/user/:id', passport.authenticate('jwt', { session: false}),  getProfileBuId );

    return server;
};