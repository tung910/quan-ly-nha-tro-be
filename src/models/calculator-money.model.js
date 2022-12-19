const mongoose = require('mongoose');

const CalculatorMoneySchema = new mongoose.Schema(
    {
        dataWaterID: {
            type: mongoose.ObjectId,
            ref: 'Water',
            required: true,
        },
        dataPowerID: {
            type: mongoose.ObjectId,
            ref: 'DataPower',
            required: true,
        },
        motelID: {
            type: mongoose.ObjectId,
            ref: 'Motel',
            required: true,
        },
        motelRoomID: {
            type: mongoose.ObjectId,
            ref: 'MotelRoom',
        },
        roomRentalDetailID: {
            type: mongoose.ObjectId,
            ref: 'RoomRentalDetail',
            required: true,
        },
        paymentStatus: {
            type: Boolean,
            default: false,
        },
        payer: {
            type: String,
            default: '',
        },
        dateOfPayment: {
            type: String,
            default: '',
        },
        paymentMethod: {
            type: Number,
            default: 0,
        },
        month: {
            type: String,
            required: true,
        },
        year: {
            type: String,
            required: true,
        },
        remainAmount: {
            type: Number,
            default: 0,
        },
        previousRemain: {
            type: Number,
            default: 0,
        },
        totalAmount: {
            type: Number,
            default: 0,
        },
        payAmount: {
            type: Number,
            default: 0,
        },
        motelRoomId: {
            type: mongoose.ObjectId,
            ref: 'MotelRoom',
        },
        note: {
            type: String,
        },
    },
    { collection: 'CalculatorMoney', timestamps: true }
);

module.exports = mongoose.model('CalculatorMoney', CalculatorMoneySchema);
