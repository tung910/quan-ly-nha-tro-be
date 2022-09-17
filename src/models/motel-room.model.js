const mongoose = require('mongoose');

const MotelRoomSchema = new mongoose.Schema(
    {
        roomName: {
            type: String,
            require: true,
            minLength: 3,
        },
        customerName: {
            type: String,
            require: true,
            minLength: 3,
        },
        maxPerson: {
            type: Number,
            default: 1,
        },
        images: {
            type: Array,
        },
        description: {
            type: String,
        },
        width: {
            type: Number,
            require: true,
        },
        height: {
            type: Number,
            require: true,
        },
        unitPrice: {
            type: Number,
            require: true,
        },
        lease: {
            type: Array,
        },
        motelID: {
            type: mongoose.ObjectId,
            ref: 'Motel',
        },
        isDebit: {
            type: Boolean,
            default: false,
        },
        isRent: {
            type: Boolean,
            default: false,
        },
        customerID: {
            type: mongoose.ObjectId,
            ref: 'Customer',
        },
    },
    { collection: 'MotelRoom', timestamps: true }
);

module.exports = mongoose.model('MotelRoom', MotelRoomSchema);
