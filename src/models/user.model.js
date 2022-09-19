const mongoose = require('mongoose');
const createHmac = require('crypto');

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
        default:1
    }

}, { timestamps: true });

UserSchema.methods = {
    authenticate(password) {
        return this.password == this.encryPassword(password);
    },
    encryPassword(password) {
        if (!password) return;
        try {
            return createHmac('sha256', 'datn_tw13').update(password).digest('hex');
        } catch (error) {
            console.log(error);
        }
    }
}

UserSchema.pre('save', function (next) {
    this.password = this.encryPassword(this.password);
    next();
})

module.exports = mongoose.model('User', UserSchema);

