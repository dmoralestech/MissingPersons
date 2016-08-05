/**
 * @description Configuration, singleton. By default, NodeJS does caching on required objects in a way a singleton, so this is simply a Java-look-n-feel design.
 * @author Philip Senger
 * @date July 30 2016
 * @module lib
 */

let twelve = require('twelve'),
    dotenv = require('dotenv');

// Instance, designed to store a reference to the Singleton
let instance;

let init = function init() {
    // Private methods and variables

    /**
     * Load in the .env first, .env overrides environment variables!
     */
    dotenv.config( { silent:false } );

    return twelve.env({
        'api:port': {
            name: 'PORT',
            parse: function (value) {
                return parseInt(value);
            }
        },
        'api:environment': {
            name: 'NODE_ENV',
            default: 'development'
        },
        'api:database': {
            name: 'DATABASE'
        }
    });
};

module.exports = {
    /**
     * Get the instance, create it if it doesnt exist.
     * @returns {*}
     */
    getInstance: function () {
        if ( !instance ) {
            instance = init();
        }
        return instance;
    }
};


