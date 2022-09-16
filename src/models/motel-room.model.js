const mongoose = require('mongoose');

const MotelRoomSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
            minLength: 5,
        },
        maximumNumberOfPeople: {
            type: Number,
            default: 1,
        },
        images: {
            type: Array,
        },
        description: {
            type: String,
        },
        width: {
            type: Number,
            require: true,
        },
        height: {
            type: Number,
            require: true,
        },
        unitPrice: {
            type: Number,
            require: true,
        },
        lease: {
            type: Array,
        },
        motelId: {
            type: mongoose.ObjectId,
            ref: 'Motel',
        },
        roomStatus: {
            type: Number,
            default: 0,
        },
    },
    { collection: 'MotelRoom', timestamps: true }
);

module.exports = mongoose.model('MotelRoom', MotelRoomSchema);
