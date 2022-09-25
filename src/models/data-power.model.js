const mongoose = require('mongoose');
const DataPowerSchema = new mongoose.Schema(
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
        customerName: {
            type: String,
            required: true,
        },
        roomName: {
            type: String,
            required: true,
        },
        motelId: {
            type: mongoose.ObjectId,
            ref: 'Motel',
        },
    },
    { collection: 'DataPower', timestamps: true }
);

module.exports = mongoose.model('DataPower', DataPowerSchema);
