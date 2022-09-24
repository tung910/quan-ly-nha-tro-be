const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema(
    {
        isActive: {
            type: Boolean,
            default: true,
        },
        serviceName: {
            type: String,
            require: true,
        },
        unitPrice: {
            type: Number,
            require: true,
        },
        serviceTypeId: {
            type: Number,
            require: true,
        },
        serviceTypeName: {
            type: String,
            require: true,
        },
        note: {
            type: String,
            default: '',
        },
    },
    { collection: 'Service', timestamps: true }
);

module.exports = mongoose.model('Service', ServiceSchema);
