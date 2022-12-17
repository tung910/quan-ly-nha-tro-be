const mongoose = require('mongoose');
const MotelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            minlength: 5,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        province: {
            type: String,
            required: true,
        },
        district: {
            type: String,
            required: true,
        },
        commune: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Motel', MotelSchema);
