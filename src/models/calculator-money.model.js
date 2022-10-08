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
        roomRentalDetailID: {
            type: mongoose.ObjectId,
            ref: 'RoomRentalDetail',
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
    { timestamps: true }
);

module.exports = mongoose.model('CalculatorMoney', CalculatorMoneySchema);
