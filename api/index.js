/**
 * Created by psenger on 30/07/2016.
 */

const app = require('./package.json');
const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./lib/config').getInstance();
// const profile = require('./routes/profile');
const morgan = require('morgan');
const bunyan = require('bunyan');
const path = require('path');
const passport = require('./lib/passport');

// Morgan - Logging
// if (config.get('api:environment') == 'production') {
//     server.use(morgan('common'));
// } else {
//     server.use(morgan('dev'));
// }
// Bunyan - Logging
log = require('bunyan').createLogger({
    src: true,                     // @todo: extract the src:true to a configuration, and turn it off in production
    name: app.name,
    streams: [
        {
            level: 'info',
            stream: process.stdout // log INFO and above to stdout
        }, {
            level: 'error',
            path: path.join(__dirname, 'log', 'error.log')  // log ERROR and above to a file
        },
        {
            level: 'debug',
            path: path.join(__dirname, 'log', 'debug.log')  // log ERROR and above to a file
        }
    ]
});

var options = {
    name: app.name, // http header 'Server:'
    acceptable: ['application/json'],
    version: app.version,
    /** injects the http header 'Api-Version:'  default version for all routes, will translate to the last npm bumped version **/
    log: log
};

if (config.get('api:environment') === 'development') {
    console.log("!!!!!!!!!!!!!!!!!!!!!");
    console.log("!! Warning:        !!");
    console.log("!!                 !!");
    console.log("!!       SSL OFF   !!");
    console.log("!!                 !!");
    console.log("!!!!!!!!!!!!!!!!!!!!!");
} else {
    console.log("!!!!!!!!!!!!!!!!!!!!!");
    console.log("!! Warning:        !!");
    console.log("!!                 !!");
    console.log("!!       SSL ON    !!");
    console.log("!!                 !!");
    console.log("!!!!!!!!!!!!!!!!!!!!!");
    options = Object.assign(options, {
        key: fs.readFileSync('../ssl/server.key'),
        cert: fs.readFileSync('../ssl/server.crt'),
        ca: fs.readFileSync('../ssl/ca.crt'),
        requestCert: true,
        rejectUnauthorized: false,
        passphrase: '8080'
    });
}

// Attaching a locals.conf object to the restify Object. The config
// object will contain the server's running properties (as defined
// by the application) making it available to all the routes
restify.locals = {};
restify.locals.config = config;

var server = restify.createServer(options);

server.pre(restify.pre.sanitizePath());
server.use(restify.CORS());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(passport.initialize());

if (config.get('api:environment') == 'development') {
    console.log('Mongoose debug is on');
    mongoose.set('debug', true);
} else {
    console.log('Mongoose debug is off');
}
mongoose.Promise = require('bluebird');
mongoose.connect(config.get('api:database'), function (error) {
    if (error) {
        console.error('Could not connect to DB: %s', error);
        process.exit(1);
    }
});
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + config.get('api:database'));
});
mongoose.connection.on('error', function (error) {
    console.error('MongoDB connection error: %s', error);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});

//[   'del',
//    'get',
//    'head',
//    'opts',
//    'post',
//    'put',
//    'patch'
//].forEach(function (method) {
//    server[method]('/secure', passport.authenticate('jwt', { session: false } ) );
//});
//
// server.get({path: '/profile', version: ['1.0.0']}, profile(mongoose));


server = require('./routes/login')(server, passport);
server = require('./routes/profile')(server, passport);

server.listen(config.get('api:port'), function () {
    console.log('%s listening at %s in %s mode.', server.name, server.url, config.get('api:environment'));
});