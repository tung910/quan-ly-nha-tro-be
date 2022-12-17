const mongoose = require('mongoose');
const Customer = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minLength: 5,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        gender: {
            type: Number,
            default: 0,
        },
        address: {
            type: String,
            require: true,
        },
        birthPlace: {
            type: String,
            required: true,
        },
        carNumber: {
            type: String,
        },
        issuedBy: {
            type: String,
            required: true,
        },
        deposit: {
            type: Number,
            default: 3000000,
        },
        startDay: {
            type: Date,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        dateRange: {
            type: Date,
            required: true,
        },
        dateOfBirth: {
            type: Date,
            required: true,
        },
        citizenIdentificationNumber: {
            type: String,
            required: true,
        },
    },
    { collection: 'Customer', timestamps: true }
);
module.exports = mongoose.model('Customer', Customer);
