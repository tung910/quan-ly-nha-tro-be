const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');
const NotificationModel = require('~/models/notification.model');

module.exports = {
    createNotification: asyncUtil(async (req, res) => {
        const { data, isUpdate, notificationId } = req.body;
        if (isUpdate && notificationId) {
            await NotificationModel.findByIdAndUpdate(
                { _id: notificationId },
                { isSend: true }
            );
        } else {
            await NotificationModel.create(data);
        }
        return AppResponse.success(req, res)(null);
    }),
    getNotifications: asyncUtil(async (req, res) => {
        const notifications = await NotificationModel.find({}).populate({
            path: 'userId',
            select: ['name', 'email'],
        });
        return AppResponse.success(req, res)(notifications);
    }),
};
