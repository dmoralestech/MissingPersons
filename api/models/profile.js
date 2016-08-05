/**
 * Created by psenger on 30/07/2016.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var roles = 'user admin'.split(' ');

var NameSchema = {
    first: {type: String, trim: true},
    middle: {type: String, trim: true},
    surname: {type: String, trim: true}
};

var ProfileSchema = new Schema({
    email: {type: String, lowercase: true, unique: true},
    name: NameSchema,
    policy: {type: String},
    roles: [{type: String, enum: roles}],
    confirmed: {
        email: {type: Boolean, default: false} /** indicates the email has been confirmed **/
    },
    userHash: {type: String},
    userSalt: {type: String},
    activity: {
        loginFailureCount: {type: Number, default: 0},
        lastSuccessfulLogin: {type: Date, default: Date.now},
        createdOn: {type: Date, default: Date.now},
        modifiedOn: {type: Date, default: Date.now}
    }
}, {safe: true, strict: true});

ProfileSchema.index({email: 1});
ProfileSchema.index({policy: 1});

module.exports = ProfileSchema;