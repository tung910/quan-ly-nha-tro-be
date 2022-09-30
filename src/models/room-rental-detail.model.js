const mongoose = require('mongoose');

const RoomRentalDetailSchema = new mongoose.Schema(
    {
        customerName: {
            type: String,
            require: true,
            minlength: 5,
        },
        roomName: {
            type: String,
            default: '',
        },
        motelRoomID: {
            type: mongoose.ObjectId,
            ref: 'MotelRoom',
        },
        userID: {
            type: mongoose.ObjectId,
            ref: 'User',
        },
        citizenIdentification: {
            type: Number,
            require: true,
        },
        address: {
            type: String,
            require: true,
        },
        dateRange: {
            // ngày cấp
            type: String,
            require: true,
        },
        issuedBy: {
            // Nơi cấp
            type: String,
        },
        gender: {
            type: Number,
        },
        birthPlace: {
            //nơi sinh
            type: String,
        },
        dateOfBirth: {
            type: String,
        },
        phone: {
            type: Number,
            require: true,
        },
        rentalStartDate: {
            type: String,
        },
        deposit: {
            //tiền cọc
            type: Number,
        },
        licensePlates: {
            type: String,
        },
        payType: {
            type: String,
        },
        payEachTime: {
            // số lần thanh toán
            type: String,
        },
        member: {
            type: Array,
        },
        service: {
            type: Array,
        },
        priceRoom: {
            type: Number,
            require: true,
        },
        startDate: {
            type: Date,
            require: true,
        },
        paymentPeriod: {
            type: String,
            default: 10,
        },
        email: {
            type: String,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('RoomRentalDetail', RoomRentalDetailSchema);
