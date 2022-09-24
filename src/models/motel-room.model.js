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
            default: '',
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
            // tien nợ
            type: Boolean,
            default: false,
        },
        isRent: {
            // tiền cọc
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
