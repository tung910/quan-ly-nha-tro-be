const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');
const RoomRentalDetailModel = require('~/models/room-rental-detail.model');
const MotelRoomModel = require('~/models/motel-room.model');

module.exports = {
    exportWordContract: asyncUtil(async (req, res) => {
        const rentalId = req.params.rentalId;
        const RoomRentalDetail = await RoomRentalDetailModel.findById({
            _id: rentalId,
        });
        const MotelRoom = await MotelRoomModel.findById({
            _id: RoomRentalDetail.motelRoomID,
        });

        return AppResponse.success(
            req,
            res
        )({
            roomRentalDetail: RoomRentalDetail,
            motelRoom: MotelRoom,
        });
    }),
};
