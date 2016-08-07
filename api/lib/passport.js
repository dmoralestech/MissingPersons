/**
 * Created by psenger on 8/6/16.
 */
let mongoose = require('mongoose'),
    // LocalStrategy = require('passport-local').Strategy,
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    User = require('../models/user'); /** TODO: lets see if we can leverage the auto load of resources here. **/

/** TODO: get this out of here. **/
let opts = {};
opts.tokenBodyField = "MY_CUSTOM_BODY_FIELD";
opts.secretOrKey = 'secret';
opts.issuer = "accounts.examplesoft.com";
opts.audience = "yoursite.net";

module.exports = function (passport, config) {
    /** TODO: do we need this ? */
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    /** TODO: do we need this ? */
    passport.deserializeUser(function (id, done) {
        User.findOne({_id: id}, function (err, user) {
            done(err, user);
        });
    });
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        User.findOne({id: jwt_payload.sub}, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
                // or you could create a new account
            }
        });
    }));
}

