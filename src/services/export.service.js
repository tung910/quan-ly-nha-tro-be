const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');
const RoomRentalDetailModel = require('~/models/room-rental-detail.model');
const MotelRoomModel = require('~/models/motel-room.model');
const MotelModel = require('~/models/motel.model');

module.exports = {
    exportWordContract: asyncUtil(async (req, res) => {
        const rentalId = req.params.rentalId;
        const RoomRentalDetail = await RoomRentalDetailModel.findById({
            _id: rentalId,
        });
        const MotelRoom = await MotelRoomModel.findById({
            _id: RoomRentalDetail.motelRoomID,
        });
        const Motel = await MotelModel.findById({ _id: MotelRoom.motelID });
        const resData = {
            lessor: {
                name: 'Trần Thanh Tùng',
                citizenIdentificationNumber: '0123456789',
                address: 'Ha Noi',
                phone: 031234567,
                dateOfBirth: '09/10/2002',
                dateRange: '01/01/2020',
                issuedBy: 'Nam Dinh',
            },
            roomRentalDetail: RoomRentalDetail,
            motelRoom: MotelRoom,
            motel: Motel,
        };

        return AppResponse.success(req, res)(resData);
    }),
};
