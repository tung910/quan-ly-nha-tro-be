const mongoose = require('mongoose');

const RevenueStatisticsSchema = new mongoose.Schema(
    {
        totalPaymentAmount: {
            type: Number,
            required: true,
        },
        totalPaymentUnpaid: {
            type: Number,
            required: true,
        },
        totalBill: {
            type: Number,
            required: true,
        },
        totalBillPaid: {
            type: Number,
            required: true,
        },
        totalBillUnpaid: {
            type: Number,
            required: true,
        },
        month: {
            type: String,
            required: true,
        },
        year: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model('RevenueStatistics', RevenueStatisticsSchema);
