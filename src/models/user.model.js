const mongoose = require('mongoose');
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
}, { collection: "User", timestamps: true });

module.exports = mongoose.model('User', UserSchema);


