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
            unique: true,
        },
        address: {
            type: String,
        },
        phone: {
            type: String,
        },
        motelRoomID: {
            type: mongoose.ObjectId,
            ref: 'MotelRoom',
        },
        role: {
            type: Number,
            default: 0,
        },
        avatar: {
            type: String,
            default:
                'https://res.cloudinary.com/dhfndew6y/image/upload/v1666108397/upload-by-nodejs/kbd0oqh53vnet31epfdf.png',
        },
        images: {
            type: Array,
            default: [],
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
