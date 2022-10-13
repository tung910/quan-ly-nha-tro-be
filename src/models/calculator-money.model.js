const mongoose = require('mongoose');

const CalculatorMoneySchema = new mongoose.Schema(
    {
        dataWaterID: {
            type: mongoose.ObjectId,
            ref: 'Water',
        },
        dataPowerID: {
            type: mongoose.ObjectId,
            ref: 'DataPower',
        },
        motelID: {
            type: mongoose.ObjectId,
            ref: 'Motel',
        },
        roomRentalDetailID: {
            type: mongoose.ObjectId,
            ref: 'RoomRentalDetail',
        },
        payer: {
            type: String,
            default: '',
        },
        dateOfPayment: {
            type: Date,
        },
        paymentMethod: {
            type: Number,
            default: 0,
        },
        month: {
            type: String,
        },
        year: {
            type: String,
        },
        remainAmount: {
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
    },
    { collection: 'CalculatorMoney', timestamps: true }
);

module.exports = mongoose.model('CalculatorMoney', CalculatorMoneySchema);
