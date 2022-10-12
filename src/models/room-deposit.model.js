const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

const RoomDepositSchema = new Schema(
    {
        motelId: {
            type: mongoose.ObjectId,
            ref: 'Motel',
            require: true,
        },
        motelRoomId: {
            type: mongoose.ObjectId,
            ref: 'MotelRoom',
            require: true,
        },
        fullName: {
            type: String,
            require: true,
        },
        bookingDate: {
            type: Date,
            require: true,
        },
        telephone: {
            type: Number,
        },
        bookingAmount: {
            type: Number,
        },
        dateOfArrival: {
            type: Date,
            require: true,
        },
        hasCancel: {
            type: Boolean,
            default: false,
        },
        hasCheckIn: {
            type: Boolean,
            default: false,
        },
        cancelDate: {
            type: Date,
            default: null,
        },
        checkInDate: {
            type: Date,
            default: null,
        },
        note: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = model('RoomDeposit', RoomDepositSchema);
