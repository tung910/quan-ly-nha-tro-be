const mongoose = require('mongoose');
const DataPowerSchema = new mongoose.Schema(
    {
        newValue: {
            type: Number,
            default: 0,
        },
        oldValue: {
            type: Number,
            default: 0,
        },
        useValue: {
            type: Number,
            default: 0,
        },
        customerName: {
            type: String,
            default: '',
        },
        roomName: {
            type: String,
            default: '',
        },
        motelId: {
            type: mongoose.ObjectId,
            ref: 'Motel',
        },
    },
    { collection: 'DataPower', timestamps: true }
);

module.exports = mongoose.model('DataPower', DataPowerSchema);
