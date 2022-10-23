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
        month: {
            type: String,
        },
        year: {
            type: String,
        },
        roomName: {
            type: String,
            default: '',
        },
        motelID: {
            type: mongoose.ObjectId,
            ref: 'Motel',
        },
        motelRoomID: {
            type: mongoose.ObjectId,
            ref: 'MotelRoom',
        },
    },
    { collection: 'DataPower', timestamps: true }
);

module.exports = mongoose.model('DataPower', DataPowerSchema);
