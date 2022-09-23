const mongoose = require('mongoose');

const RoomRentalDetail = new mongoose.Schema({
    customerName: {
        type: String,
        require: true,
        minlength: 5
    },
    motelID: {
        type: mongoose.ObjectId,
        ref: 'Motel',
    },
    userID: {
        type: mongoose.ObjectId,
        ref: 'User',
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
        type: String,
    },
    deposit: { //tiền cọc
        type: Number,
    },
    payType: {
        type: String
    },
    member: {
        type: []
    },
    service: {
        type: []
    },
    duration: { // thời hạn
        type: String,
    }
}, { timestamps: true })

module.exports = mongoose.model('RoomRentalDetail', RoomRentalDetail)