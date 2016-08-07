/**
 * Created by psenger on 1/08/2016.
 */

"use strict";

var describe = require('mocha').describe,
    before = require('mocha').before,
    beforeEach = require('mocha').beforeEach,
    afterEach = require('mocha').afterEach,
    after = require('mocha').after,
    it = require('mocha').it,
    context = require('mocha').describe,
    expect = require('chai').expect,
    should = require('chai').should(),
    assert = require('chai').assert,
    moment = require('moment'),
    uuid = require('uuid').v4,
    bluebird = require('bluebird'),
    mongoose = require('mongoose'),
    ValidationError= require('mongoose').ValidationError,
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

        let first = 'chris';
        let middle = 'to';
        let surname = 'pher';
        let email1 =  uuid() + '@goo.com';
        let email2 =  uuid() + '@goo.com';
        let roles = ['user'];

        beforeEach(function() {
            User.find({ email: email1 }).remove();
            User.find({ email: email2 }).remove();
        });

        afterEach(function() {
            User.find({ email: email1 }).remove();
            User.find({ email: email2 }).remove();
        });

        describe('SAVE:',()=>{
            it('Should save', function ( done ) {
                let chris = new User({
                    name: {
                        first,
                        middle,
                        surname
                    },
                    email: email1,
                    roles: roles,
                    confirmed: {
                        email: true
                    },
                    password: 'password'
                });
                chris.save(function(err,nUser) {
                    should.not.exist( err );
                    expect(nUser.name.first).to.equal(first);
                    expect(nUser.name.middle).to.equal(middle);
                    expect(nUser.name.surname).to.equal(surname);
                    expect(nUser.email).to.equal(email1);
                    expect(nUser.roles).to.contain(roles[0]);
                    done();
                });
            });
        });

        describe('VALIDATE:',()=>{
            it('Should reject the save because the first name is blank',function(done){
                let chris = new User({
                    name: {
                        first:'',
                        middle,
                        surname
                    },
                    email: email2,
                    roles: roles,
                    confirmed: {
                        email: true
                    },
                    password: 'password'
                });
                chris.save(function(err,nUser) {
                    should.exist( err );
                    expect( err.message ).to.equals( 'User validation failed' );
                    expect( err.errors['name.first'].message ).to.equals( 'First Name cannot be blank' );
                    done();
                });
            });
        });
    });
});