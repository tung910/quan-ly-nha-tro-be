const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');
const NotificationModel = require('~/models/notification.model');
const MotelRoom = require('~/models/motel-room.model');

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
        const category = req.query.category || 'ChangeRoom';
        let resData;
        if (category === 'ChangeRoom') {
            resData = await NotificationModel.find({
                categories: category,
            }).populate({
                path: 'userId',
                select: ['name', 'email'],
            });
            const resDataLength = resData.length;
            for (let index = 0; index < resDataLength; index++) {
                const element = resData[index];
                element.detail.currentRoom = await handleGetMotelRoom(
                    element.detail.currentRoom
                );
                element.detail.newRoom = await handleGetMotelRoom(
                    element.detail.newRoom
                );
            }
        }

        return AppResponse.success(req, res)(resData);
    }),
};

const handleGetMotelRoom = async (data) => {
    const res = await MotelRoom.findById(data).select([
        'roomName',
        'width',
        'height',
        'unitPrice',
    ]);
    return res;
};
