const mongoose = require('mongoose');

const RevenueStatisticsSchema = new mongoose.Schema(
    {
        totalAmount: {
            type: Number,
            required: true,
        },
        month: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model('RevenueStatistics', RevenueStatisticsSchema);
