const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');
const NotificationModel = require('~/models/notification.model');
const MotelRoom = require('~/models/motel-room.model');
const roomRentalDetailController = require('~/controllers/room-rental-detail.controller');
const RoomRentalDetail = require('~/models/room-rental-detail.model');

module.exports = {
    addOrUpdateNotification: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const isUpdate = data?.isUpdate || false;
        const notificationId = data?.notificationId || '';

        if (isUpdate && notificationId) {
            const updateValue = {
                isSeen: true,
                detail: { ...data.detail },
            };
            await NotificationModel.findByIdAndUpdate(
                { _id: notificationId },
                updateValue
            );
            const roomRentalDetail = await RoomRentalDetail.findOne({
                motelRoomID: data.detail.currentRoom._id,
            });
            const dataChange = {
                DateChangeRoom: Date(),
                NewRoomID: data.detail.newRoom._id,
                roomRentalDetail: roomRentalDetail._id,
            };
            await roomRentalDetailController.changeRoom(dataChange);
        } else {
            await NotificationModel.create(data);
        }
        return AppResponse.success(req, res)(null);
    }),
    getNotifications: asyncUtil(async (req, res) => {
        const category = req.query?.category || 'ChangeRoom';
        const userId = req.query?.userId || '';
        let resData;

        if (category === 'ChangeRoom') {
            resData = await NotificationModel.find({
                categories: category,
            })
                .populate({
                    path: 'userId',
                    select: ['name', 'email'],
                })
                .lean();
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
        if (userId) {
            let options = { userId };
            if (category === 'ChangeRoom') {
                options = {
                    ...options,
                    categories: category,
                };
            }
            resData = await NotificationModel.find(options).lean();
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
