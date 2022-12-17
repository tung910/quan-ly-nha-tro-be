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
        area: {
            type: Number,
            required: true,
            default: 25
        },
        unitPrice: {
            type: Number,
            required: true,
        },
        lease: {
            type: Array,
        },
        licensePlates: {
            type: String,
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
        roomRentID: {
            type: mongoose.ObjectId,
            ref: 'RoomRentalDetail',
        },
        avatarCustomer: {
            type: String,
        },
    },
    { collection: 'MotelRoom', timestamps: true }
);

module.exports = mongoose.model('MotelRoom', MotelRoomSchema);
