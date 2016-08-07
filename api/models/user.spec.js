/**
 * Created by psenger on 1/08/2016.
 */

"use strict";

var describe = require('mocha').describe,
    before = require('mocha').before,
    after = require('mocha').after,
    it = require('mocha').it,
    context = require('mocha').describe,
    expect = require('chai').expect,
    should = require('chai').should,
    assert = require('chai').assert,
    moment = require('moment'),
    uuid = require('uuid').v4,
    bluebird = require('bluebird'),
    mongoose = require('mongoose'),
    config = require('../lib/config').getInstance();

describe('MODELS:', () => {


    mongoose.set('debug', true);
    mongoose.connect(config.get('api:database'), function (error) {
        if (error) {
            console.error('Could not connect to DB: %s', error);
            process.exit(1);
        }
    });
    mongoose.connection.on('error', function (error) {
        console.error('MongoDB connection error: %s', error);
    });

    describe('USER:', () => {

        let User = require('./user');

        it('Should work', function ( done ) {

            let first = 'chris';
            let middle = 'to';
            let surname = 'pher';

            var chris = new User({
                name: {
                    first,
                    middle,
                    surname
                },
                email: 'c@goo.com',
                roles:['user'],
                confirmed: {
                    email: true
                },
                password: 'password'
            });
            chris.save(function(err,nUser) {
                if (err) throw err;
                console.log('arguments', arguments);
                done();
            });
        });
    });
});