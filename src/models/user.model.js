const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            minLength: 5,
        },
        email: {
            type: String,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        citizenIdentificationNumber: {
            type: String,
        },
        address: {
            type: String,
        },
        phone: {
            type: String,
        },
        role: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

UserSchema.methods = {
    async authenticate(password) {
        const isValid = await bcrypt.compare(password, this.password);
        return isValid;
    },
};

module.exports = mongoose.model('User', UserSchema);
