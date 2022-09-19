const mongoose = require('mongoose');
const createHmac = require('crypto');
const { v4: uuidv4 } = require('uuid');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 5
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    cccd: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true
    }, role: {
        type: Number,
        default: 1
    }

}, { timestamps: true });


UserSchema.pre('save', function (next) {
    this.salt = uuidv4();
    this.password = this.encryptPassword(this.password);
    next();
});

UserSchema.methods = {
    authenticate(password) {
        return this.password === this.encryptPassword(password);
    },
    encryptPassword(password) {
        if (!password) return;
        try {
            return createHmac('sha256', this.salt).update(password).digest('hex');
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = mongoose.model('User', UserSchema);

