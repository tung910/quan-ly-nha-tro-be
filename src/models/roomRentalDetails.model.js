const mongoose = require('mongoose');

const RoomRentalDetail = new mongoose.Schema({
    customerName: {
        type: String,
        require: true,
        minlength: 5
    },
    motelRoomID: {
        type: mongoose.ObjectId,
        ref: 'MotelRoom',
    },
    userID: {
        type: mongoose.ObjectId,
        ref: 'User',
    },
    ccnd: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    dateRange: { // ngày cấp
        type: String,
        require: true
    },
    issuedBy: { // Nơi cấp
        type: String,
    },
    gender: {
        type: Number,
    },
    birthPlace: { //nơi sinh
        type: String
    }
    ,
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
    licensePlates: {
        type: String,
    },
    payType: {
        type: String
    },
    payEachTime: { // số lần thanh toán
        type: String,
    },
    member: {
        type: Array
    },
    service: {
        type: Array
    },
    priceRoom: {
        type: Number,
        require: true
    },
    startDay: {
        type: Date,
        require: true
    }
}, { timestamps: true })

module.exports = mongoose.model('RoomRentalDetail', RoomRentalDetail)