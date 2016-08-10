/**
 * Created by psenger on 1/08/2016.
 */

var User = require('../models/user'),
    jwt = require('jsonwebtoken'),
    moment = require('moment'),
    config = require('../lib/config').getInstance(),
    NotFoundError = require('restify').errors.NotFoundError, /** @TODO: PAS not used, and needs to be **/
    BadRequestError = require('restify').errors.BadRequestError;

module.exports = function (server, passport) {

    server.post('/register', function (req, res) {
        /** @TODO: PAS not done **/
    });

    server.post('/login', function (req, res, next) {
        User.findOne({
            email: req.params.email
        }, function (err, user) {
            if (err) throw err;
            if (!user) {
                res.send({success: false, message: 'Authentication failed. User not found.'});
            } else {
                // Check if password matches
                let password = user.encryptPassword(req.params.password);
                if (user.userHashedPassword === password) {
                    let secretOrPublicKey = config.get('api:jwtpassword');

                    let algorithm = 'HS256';
                    // @@TODO: PAS expiresIn is wrong
                    let expiresIn = moment().endOf('week').unix();        // integer - Expiry in epoch seconds - This will probably be the registered claim most often used. This will define the expiration in NumericDate value. The expiration MUST be after the current date/time.
                    let notBefore = '0';                                  // integer - Not Before - Defines the time before which the JWT MUST NOT be accepted for processing
                    let audience = ['http://wwww.missingpersons.com.au']; // [string] - The audience of the token ( an array of uri or urls )
                    let issuer = 'http://wwww.missingpersons.com.au';     // string - The issuer of the token ( our website )
                    let jwtid = '1';                                      // string - JWT ID - Unique identifier for the JWT. Can be used to prevent the JWT from being replayed. This is helpful for a one time use token.
                    let options = {
                        algorithm,
                        expiresIn,
                        notBefore,
                        audience,
                        issuer,
                        jwtid
                    };

                    /** iat is added by jwt **/
                    var token = jwt.sign({sub: user.id}, secretOrPublicKey, options);

                    res.json({success: true, token: token});
                } else {
                    res.send({success: false, message: 'Authentication failed.'});
                }
            }
        });

        /***
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
    });

    return server;
};