/**
 * Created by psenger on 8/6/16.
 */
let mongoose = require('mongoose'),
    config = require('../lib/config').getInstance(),
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    User = require('../models/user'); /** TODO: lets see if we can leverage the auto load of resources here. **/

/** TODO: get this out of here. **/
let opts = {};
opts.secretOrKey = config.get('api:jwtpassword');
opts.issuer = "missing.persons.com";
opts.audience = ["missing.persons.com"];

/**
 * Header defined:
 * {
 *   "alg": "HS256",
 *   "typ": "JWT"
 * }
 */

/**
 * Will expect the JWT to be in the header.
 * <code>
 * Authorization: JWT JSON_WEB_TOKEN_STRING
 * </code>
 *
 * @param passport
 * @param config
 */
module.exports = function (passport, config) {
    //
    // -- because we don't use a cookie... this doesnt work?
    //
    // /** TODO: do we need this ? */
    // passport.serializeUser(function (user, done) {
    //     done(null, user.id);
    // });
    // /** TODO: do we need this ? */
    // passport.deserializeUser(function (id, done) {
    //     User.findOne({_id: id}, function (err, user) {
    //         done(err, user);
    //     });
    // });
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        /**
         * Private Claim ( not registered ) JWT Payload defined:
         *  {
         *    iss: string - The issuer of the token ( our website )
         *    sub: string - The subject of the token ( the user id )
         *    aud: [string] - The audience of the token ( an array of uri or urls )
         *    exp: integer - Expiry - This will probably be the registered claim most often used. This will define the expiration in NumericDate value. The expiration MUST be after the current date/time.
         *    nbf: integer - Not Before - Defines the time before which the JWT MUST NOT be accepted for processing
         *    iat: integer - Issued At - The time the JWT was issued. Can be used to determine the age of the JWT
         *    jti: string - JWT ID - Unique identifier for the JWT. Can be used to prevent the JWT from being replayed. This is helpful for a one time use token.
        *   }
         */
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

