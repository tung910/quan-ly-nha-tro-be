const MotelRoomModel = require('~/models/motel-room.model');
const DataPowerModel = require('~/models/data-power.model');
const DataWaterModel = require('~/models/water.model');
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');

module.exports = {
    getAllMotelRoom: asyncUtil(async (req, res) => {
        let motelRoom;
        const roomId = req.query.roomId;
        if (roomId) {
            motelRoom = await MotelRoomModel.find({ motelID: roomId });
        } else {
            motelRoom = await MotelRoomModel.find({});
        }
        return AppResponse.success(req, res)(motelRoom);
    }),
    createMotelRoom: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const crea = await DataPowerModel.create(data);
        console.log("crate",crea)
        await DataWaterModel.create(data);
        const motelRoom = await MotelRoomModel.create(data);
        return AppResponse.success(req, res)(motelRoom);
    }),
    editMotelRoom: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const motelRoom = await MotelRoomModel.findOneAndUpdate(
            {
                _id: req.params.id,
            },
            data,
            { new: true }
        ).exec();
        return AppResponse.success(req, res)(motelRoom);
    }),
    removeMotelRoom: asyncUtil(async (req, res) => {
        const motelRoom = await MotelRoomModel.findByIdAndDelete({
            _id: req.params.id,
        }).exec();
        return AppResponse.success(req, res)(motelRoom);
    }),
    getMotelRoom: asyncUtil(async (req, res) => {
        const motelRoom = await MotelRoomModel.findById({ _id: req.params.id });
        return AppResponse.success(req, res)(motelRoom);
    }),
    statisticalRoomStatus: asyncUtil(async (req, res) => {
        const areRenting = [];
        const emptyRooms = [];
        const rooms = await MotelRoomModel.find({});
        rooms.forEach((room) => {
            if (room.isRent) {
                areRenting.push(room);
            } else {
                emptyRooms.push(room);
            }
        });
        const response = [
            { statusName: 'Đang thuê', areRenting },
            { statusName: 'Phòng trống', emptyRooms },
        ];
        return AppResponse.success(req, res)(response);
    }),
};
