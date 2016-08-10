/**
 * Created by psenger on 31/07/2016.
 */
var User = require('../models/user'),
    ResourceNotFoundError = require('restify').errors.ResourceNotFoundError,
    NotFoundError = require('restify').errors.NotFoundError,
    BadRequestError = require('restify').errors.BadRequestError;


module.exports = function (server,passport) {

    let authenticate = passport.authenticate('jwt', {session: false});

    let getProfileBuId = (req, res, next) => {
        /** @TODO: PAS needs to be completed **/
        User.findOne({
            _id: req.params.id
        }, function (err, user) {
            if (err) throw err;
            if ( req.user._id != req.params.id )
            if (!user) {
                next(new ResourceNotFoundError(err, req.path()));
            } else {
                /** @TODO: PAS needs to be tested **/
                delete user.userHashedPassword;
                delete user.salt;
                delete user.__v;
                delete user.activity;
                res.json(user);
            }
        });
    };

    server.get('/profile/:id', authenticate, getProfileBuId);

    return server;
};