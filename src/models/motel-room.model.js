const mongoose = require('mongoose');

const MotelRoomSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
            minLength: 5,
        },
        maximum_number_of_people: {
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
        unit_price: {
            type: Number,
            require: true,
        },
        lease: {
            type: Array,
        },
        motel_id: {
            type: mongoose.ObjectId,
            ref: 'Motel',
        },
        room_status: {
            type: Number,
            default: 0,
        },
    },
    { collection: 'MotelRoom', timestamps: true }
);

module.exports = mongoose.model('MotelRoom', MotelRoomSchema);
