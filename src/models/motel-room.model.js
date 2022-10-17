const mongoose = require('mongoose');

const MotelRoomSchema = new mongoose.Schema(
    {
        roomName: {
            type: String,
            required: true,
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
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
        unitPrice: {
            type: Number,
            required: true,
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
        roomRentID: {
            type: mongoose.ObjectId,
            ref: 'RoomRentalDetail',
        },
    },
    { collection: 'MotelRoom', timestamps: true }
);

module.exports = mongoose.model('MotelRoom', MotelRoomSchema);
