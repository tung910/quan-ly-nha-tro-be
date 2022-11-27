const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');
const RoomDepositModel = require('~/models/room-deposit.model');
const MotelRoomModel = require('~/models/motel-room.model');

module.exports = {
    getAllRoomDeposit: asyncUtil(async (req, res) => {
        const {
            data: { fromDate, toDate, motelId, motelRoomId },
        } = req.body;
        if (new Date(fromDate) > new Date(toDate)) {
            return AppResponse.fail(
                req,
                res,
                400
            )(null, 'Vui lòng kiểm tra lại');
        }
        let options = {
            bookingDate: {
                $gt: new Date(fromDate),
                $lt: new Date(toDate),
            },
        };
        if (motelId || motelRoomId) {
            options = {
                ...options,
                motelId: motelId,
                motelRoomId: motelRoomId,
            };
        }

        const RoomDeposit = await RoomDepositModel.find(options)
            .populate('motelRoomId')
            .populate('motelId');
        return AppResponse.success(req, res)(RoomDeposit);
    }),
    getRoomDeposit: asyncUtil(async (req, res) => {
        const motelRoomId = req?.query?.roomId;
        const roomDepositId = req?.query?.roomDepositId;
        let options = {};
        if (motelRoomId) {
            options = {
                ...options,
                motelRoomId: motelRoomId,
            };
        }
        if (roomDepositId) {
            options = {
                ...options,
                _id: roomDepositId,
            };
        }
        const RoomDeposit = await RoomDepositModel.findOne(options);
        return AppResponse.success(req, res)(RoomDeposit);
    }),
    addOrUpdate: asyncUtil(async (req, res) => {
        const { isUpdate, data } = req.body;
        if (!isUpdate) {
            const exitRoomDeposit = await RoomDepositModel.findOne({
                motelRoomId: data.motelRoomId,
            });
            const motelRoom = await MotelRoomModel.findById(data.motelRoomId);
            if (motelRoom.isRent) {
                return AppResponse.fail(
                    req,
                    res,
                    400
                )(null, 'Phòng đã có người ở');
            }
            if (exitRoomDeposit) {
                return AppResponse.fail(
                    req,
                    res,
                    400
                )(null, 'Phòng đã được đặt, vui lòng chọn phòng khác');
            }
            const roomDeposit = await RoomDepositModel.create(data);
            return AppResponse.success(req, res)(roomDeposit);
        } else {
            if (data?.motelRoomId) {
                const motelRoom = await MotelRoomModel.findById(
                    data.motelRoomId
                );
                if (motelRoom.isRent) {
                    return AppResponse.fail(
                        req,
                        res,
                        400
                    )(null, 'Phòng đã có người ở');
                }
            }
            const roomDeposit = await RoomDepositModel.findByIdAndUpdate(
                req.query.id,
                data
            );
            return AppResponse.success(req, res)(
                roomDeposit,
                'Update successfully'
            );
        }
    }),
    removeRoomDeposit: asyncUtil(async (req, res) => {
        const roomDeposit = await RoomDepositModel.findByIdAndDelete(
            req.params.id
        );
        return AppResponse.success(req, res)(
            roomDeposit,
            'Delete successfully'
        );
    }),
    updateStatus: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const roomDeposit = await RoomDepositModel.findByIdAndUpdate(
            req.params.id,
            data,
            { new: true }
        ).exec();
        console.log(roomDeposit);
        return AppResponse.success(req, res)(
            roomDeposit,
            'Update successfully'
        );
    }),
};
