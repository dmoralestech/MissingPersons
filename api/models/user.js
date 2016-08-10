/**
 * Created by psenger on 30/07/2016.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var roles = 'user admin'.split(' ');
// var emailTypes = 'home work'.split(' ');
var phoneTypes = 'home work mobile'.split(' ');
var addressesTypes = 'home work'.split(' ');

const validatePresenceOf = value => value && value.length != 0;

/**
 * http://passportjs.org/docs/profile
 * https://gist.github.com/mlconnor/6998351
 * http://microformats.org/wiki/contact-formats
 * https://ldapwiki.willeke.com/wiki/Portable%20Contacts
 * http://hdknr.github.io/docs/identity/poco.html
 */
var NameSchema = {
    givenName: {type: String, trim: true},
    middleName: {type: String, trim: true},
    familyName: {type: String, trim: true}
};
// var EmailSchema = {
//     value: {type: String, lowercase: true, trim: true},
//     type: {type: String, enum: emailTypes}
// };
var AddressesSchema = {
    type: {type: String, enum: addressesTypes},
    streetAddress: {type: String, trim: true},
    locality: {type: String, trim: true},
    region: {type: String, trim: true},
    postalCode: {type: String, trim: true},
    country: {type: String, trim: true}
};

var PhoneNumbersSchema = {
    type: {type: String, enum: phoneTypes},
    value: {type: String, trim: true},
};

var UserSchema = new Schema({
    email: {type: String, lowercase: true, unique: true},
    // emails: [EmailSchema],
    name: NameSchema,
    phoneNumbers:[ PhoneNumbersSchema ],
    displayName: {type: String},
    addresses: [ AddressesSchema ],
    photos:[{ value: {type: String} }],
    roles: [{type: String, enum: roles}],
    confirmed: {
        email: {type: Boolean, default: false} /** indicates the email has been confirmed **/
    },
    userHashedPassword: {type: String},
    salt: {type: String},
    activity: {
        loginFailureCount: {type: Number, default: 0},
        lastSuccessfulLogin: {type: Date, default: Date.now},
        createdOn: {type: Date, default: Date.now},
        modifiedOn: {type: Date, default: Date.now}
    }
}, {safe: true, strict: true});

/** Validators **/

UserSchema.path('name.givenName').validate(validatePresenceOf, 'First Name cannot be blank');

UserSchema.path('name.familyName').validate(validatePresenceOf, 'Surname cannot be blank');

UserSchema.path('email').validate(function (email, fn) {
    const User = mongoose.model('User');
    // Check only when it is a new user or when email field is modified
    if (this.isNew || this.isModified('email')) {
        User.find({ email: email }).exec(function (err, users) {
            fn(!err && users.length === 0);
        });
    } else fn(true);
}, 'Email already exists');

UserSchema.path('userHashedPassword').validate(function (hashed_password) {
    return hashed_password.length && this._password.length;
}, 'Password cannot be blank');

/** index **/

UserSchema.index({email: 1});

UserSchema.index({policy: 1});

/**
 * Pre-save hook
 */
// UserSchema.pre('save', function (next) {
//     if (!this.isNew) return next();
//     if (!validatePresenceOf(this.password)) {
//         next(new Error('Invalid password'));
//     } else {
//         next();
//     }
// });

UserSchema.methods = {
    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },
    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
        } catch (err) {
            return '';
        }
    }
};

/**
 * Virtuals
 */
UserSchema
    .virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.userHashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });


module.exports = mongoose.model('User', UserSchema);