const RoomRentalDetail = require('~/models/roomRentalDetails.model');
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');
const MotelRoomModel = require('~/models/motel-room.model');


module.exports = {
    createRoomRentalDetail: asyncUtil(async (req, res) => {
        const { data } = req.body;
        console.log('data', data);
        await MotelRoomModel.findByIdAndUpdate(
            { motelRoomId: data.numberRoom },
            { isRent: true, customerName: data },
        ).exec();
        const roomRentalDetail = await RoomRentalDetail(data).save();
        return AppResponse.success(req, res)(roomRentalDetail);
    }),
    getAllRoomRentalDetail: asyncUtil(async (req, res) => {
        const roomRentalDetail = await RoomRentalDetail.find({});
        return AppResponse.success(req, res)(roomRentalDetail);
    }),
    deleteRoomRentalDetail: asyncUtil(async (req, res) => {
        const roomRentalDetail = await RoomRentalDetail.findOneAndDelete({
            _id: req.params.id
        }).exec();
        return AppResponse.success(req, res)(roomRentalDetail);
    }),
    getRoomRentalDetail: asyncUtil(async (req, res) => {
        const roomRentalDetail = await RoomRentalDetail.findOne({
            _id: req.params.id,
        }).exec();
        return AppResponse.success(req, res)(roomRentalDetail);
    }),
    editRoomRentalDetail: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const roomRentalDetail = await RoomRentalDetail.findOneAndUpdate(
            {
                _id: req.params.id,
            },
            data,
            { new: true }
        ).exec();
        return AppResponse.success(req, res)(roomRentalDetail);
    }),
};