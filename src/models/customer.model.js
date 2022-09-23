const mongoose = require('mongoose');
const Customer = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
            minLength: 5,
        },
        phoneNumber: {
            type: String,
            require: true,
        },
        address: {
            type: String,
            require: true,
        },
        citizenIdentificationNumber: {
            type: String,
            require: true,
        },
        motelRoomId: {
            type: mongoose.ObjectId,
            ref: 'MotelRoom',
        },
    },
    { collection: 'Customer', timestamps: true }
);
module.exports = mongoose.model('Customer', Customer);
