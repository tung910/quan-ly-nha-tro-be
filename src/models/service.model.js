const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema(
    {
        isActive: {
            type: Boolean,
            default: true,
        },
        serviceName: {
            type: String,
            required: true,
        },
        unitPrice: {
            type: Number,
            required: true,
        },
        note: {
            type: String,
            default: '',
        },
    },
    { collection: 'Service', timestamps: true }
);

module.exports = mongoose.model('Service', ServiceSchema);
