const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

const RoomDepositSchema = new Schema(
    {
        motelId: {
            type: mongoose.ObjectId,
            ref: 'Motel',
            required: true,
        },
        motelRoomId: {
            type: mongoose.ObjectId,
            ref: 'MotelRoom',
            required: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        bookingDate: {
            type: Date,
            required: true,
        },
        telephone: {
            type: Number,
        },
        bookingAmount: {
            type: Number,
        },
        dateOfArrival: {
            type: Date,
            required: true,
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
