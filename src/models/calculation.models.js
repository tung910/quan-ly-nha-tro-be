const mongoose = require('mongoose');
const CalculationSchema = new mongoose.Schema(
    {
        
    },
    { collection: 'Calculation', timestamps: true }
);

module.exports = mongoose.model('Calculation', CalculationSchema);