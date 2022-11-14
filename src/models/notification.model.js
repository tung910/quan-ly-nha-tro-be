const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const NotificationSchema = new Schema(
    {
        userId: {
            type: mongoose.ObjectId,
            ref: 'User',
        },
        data: {
            type: Object,
        },
        message: String,
        isSeen: {
            type: Boolean,
            default: false,
        },
        categories: {
            type: String,
            default: 'ChangeRoom',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);
