const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');
const RoomDepositModel = require('~/models/room-deposit.model');
const Joi = require('joi');

module.exports = {
    getAllRoomDeposit: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const response = await RoomDepositModel.find({});
        res.json(response);
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
                req.params.id,
                data
            );
            return AppResponse.success(req, res)(
                roomDeposit,
                'Update successfully'
            );
        }
    }),
};
