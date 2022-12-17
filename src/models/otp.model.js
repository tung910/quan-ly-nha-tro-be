const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const OtpSchema = new Schema(
    {
        email: String,
        OTP: String,
        password: String,
        name: String,
        phone: Number,
        time: {
            type: Date,
            default: Date.now,
            index: { expires: 60 }, //60s
        },
    },
    {
        collection: 'otp',
    }
);

OtpSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    bcrypt.hash(this.password, 10, (err, passwordHash) => {
        if (err) return next();
        this.password = passwordHash;
        next();
    });
});

OtpSchema.method.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) return cb(err);
        else {
            if (!isMatch) return cb(null, isMatch);
            return cb(null, this);
        }
    });
};

module.exports = model('otp', OtpSchema);
