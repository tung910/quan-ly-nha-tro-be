const mongoose = require('mongoose');
const Customer = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
            minLength: 5,
        },
        phoneNumber: {
            type: String,
            require: true,
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
            require: true,
        },
        carNumber: {
            type: String,
        },
        issuedBy: {
            type: String,
            require: true,
        },
        deposit: {
            type: Number,
            default: 3000000,
        },
        startDay: {
            type: Date,
            require: true,
        },
        email: {
            type: String,
            require: true,
        },
        dateRange: {
            type: Date,
            require: true,
        },
        dateOfBirth: {
            type: Date,
            require: true,
        },
        citizenIdentificationNumber: {
            type: String,
            require: true,
        },
    },
    { collection: 'Customer', timestamps: true }
);
module.exports = mongoose.model('Customer', Customer);
