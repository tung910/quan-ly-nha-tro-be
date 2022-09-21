const mongoose = require('mongoose');
const PowerSchema = new mongoose.Schema(
    {
        newValue: {
            type: Number,
            required: true,
        },
        oldValue: {
            type: Number,
            required: true,
        },
        useValue: {
            type: Number,
            required: true,
        },
        month: {
            type: Date,
            required: true,
        },
        year: {
            type: Date,
            required: true,
        },
        customerId: {
            type: mongoose.ObjectId,
            ref: 'Customer',
        },
        motelRoomId: {
            type: mongoose.ObjectId,
            ref: 'MotelRoom',
        },
        motelId: {
            type: mongoose.ObjectId,
            ref: 'Motel',
        },
    },
    { collection: 'Power', timestamps: true }
);

module.exports = mongoose.model('Power', PowerSchema);
