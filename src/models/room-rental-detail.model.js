const mongoose = require('mongoose');

const RoomRentalDetailSchema = new mongoose.Schema(
    {
        customerName: {
            type: String,
            required: true,
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
            type: String,
            required: true,
            unique: true,
        },
        address: {
            type: String,
            required: true,
        },
        dateRange: {
            // ngày cấp
            type: String,
            required: true,
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
            type: String,
            required: true,
        },
        status: {
            type: Boolean,
            default: true,
        },
        rentalStartDate: {
            type: String,
        },
        deposit: {
            type: Number,
        },
        licensePlates: {
            type: String,
        },
        payType: {
            type: String,
        },
        // payEachTime: {
        //     type: Number,
        // },
        member: {
            type: Array,
        },
        service: {
            type: Array,
        },
        priceRoom: {
            type: Number,
            required: true,
        },
        startDate: {
            type: String,
            required: true,
        },
        // paymentPeriod: {
        //     type: Number,
        //     default: 10,
        // },
        email: {
            type: String,
            required: true,
        },
        contract: {
            type: Object,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('RoomRentalDetail', RoomRentalDetailSchema);
