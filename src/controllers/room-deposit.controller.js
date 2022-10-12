const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');
const RoomDepositModel = require('~/models/room-deposit.model');

module.exports = {
    getAllRoomDeposit: asyncUtil(async (req, res) => {
        const {
            data: { fromDate, toDate },
        } = req.body;
        if (new Date(fromDate) > new Date(toDate)) {
            return AppResponse.fail(
                req,
                res,
                400
            )(null, 'Vui lòng kiểm tra lại');
        }
        const RoomDeposit = await RoomDepositModel.find({
            bookingDate: {
                $gt: new Date(fromDate),
                $lt: new Date(toDate),
            },
        });

        return AppResponse.success(req, res)(RoomDeposit);
    }),
    addOrUpdate: asyncUtil(async (req, res) => {
        const { isUpdate, data } = req.body;
        if (!isUpdate) {
            const exitRoomDeposit = await RoomDepositModel.findOne({
                motelRoomId: data.motelRoomId,
            });
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
};
