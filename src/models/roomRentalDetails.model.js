const mongoose = require('mongoose');


const RoomRentalDetail = new mongoose.Schema({
    customerName: {
        type: String,
        require: true,
        minlength: 5
    },
    idMotel: {
        type: Number,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    phoneNumber: {
        type: String,
        require: true
    },
    rentalStartDate: {
        type: Date,
        require: true
    },
    deposit: { //tiền cọc
        type: Number,
        require: true
    },
    payType: {
        type: String
    },
    member: {
        type: [{}]
    },
    service: {
        type: []
    },
    duration: { // thời hạn
        type: Date,
    }
}, { timestamps: true })

module.exports = mongoose.model('RoomRentalDetail', RoomRentalDetail)