/**
 * Created by psenger on 30/07/2016.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var roles = 'user admin'.split(' ');

const validatePresenceOf = value => value && value.length;

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
    userHashedPassword: {type: String},
    salt: {type: String},
    activity: {
        loginFailureCount: {type: Number, default: 0},
        lastSuccessfulLogin: {type: Date, default: Date.now},
        createdOn: {type: Date, default: Date.now},
        modifiedOn: {type: Date, default: Date.now}
    }
}, {safe: true, strict: true});

ProfileSchema.path('name.first').validate(function (name) {
    return name.length;
}, 'First Name cannot be blank');

ProfileSchema.path('name.surname').validate(function (name) {
    return name.length;
}, 'Surname cannot be blank');

ProfileSchema.path('email').validate(function (email, fn) {
    const Profile = mongoose.model('Profile');
    // Check only when it is a new user or when email field is modified
    if (this.isNew || this.isModified('email')) {
        Profile.find({ email: email }).exec(function (err, users) {
            fn(!err && users.length === 0);
        });
    } else fn(true);
}, 'Email already exists');

ProfileSchema.path('userHashedPassword').validate(function (hashed_password) {
    return hashed_password.length && this._password.length;
}, 'Password cannot be blank');

ProfileSchema.index({email: 1});
ProfileSchema.index({policy: 1});

/**
 * Pre-save hook
 */
// ProfileSchema.pre('save', function (next) {
//     if (!this.isNew) return next();
//     if (!validatePresenceOf(this.password)) {
//         next(new Error('Invalid password'));
//     } else {
//         next();
//     }
// });

ProfileSchema.methods = {
    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },
    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    }
};

/**
 * Virtuals
 */
ProfileSchema
    .virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.userHashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });
module.exports = ProfileSchema;