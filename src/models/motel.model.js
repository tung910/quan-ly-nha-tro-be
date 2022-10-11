const mongoose = require('mongoose');
const MotelSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            minlength: 5,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        province: { //tỉnh
            type: String,
            required: true,
        },
        district: { //quận huyện
            type: String,
            required: true,
        },
        commune: { // phường xã
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Motel', MotelSchema);
