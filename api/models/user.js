/**
 * Created by psenger on 30/07/2016.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var roles = 'user admin'.split(' ');

const validatePresenceOf = value => value && value.length != 0;

var NameSchema = {
    first: {type: String, trim: true},
    middle: {type: String, trim: true},
    surname: {type: String, trim: true}
};

var UserSchema = new Schema({
    email: {type: String, lowercase: true, unique: true},
    name: NameSchema,
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

UserSchema.path('name.first').validate(validatePresenceOf, 'First Name cannot be blank');

UserSchema.path('name.surname').validate(validatePresenceOf, 'Surname cannot be blank');

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