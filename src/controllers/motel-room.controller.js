const MotelRoomModel = require('~/models/motel-room.model');
const DataPowerModel = require('~/models/data-power.model');
const DataWaterModel = require('~/models/water.model');
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');
const roomRentalDetailModel = require('~/models/room-rental-detail.model');
const waterModel = require('~/models/water.model');
const dataPowerModel = require('~/models/data-power.model');

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
        await DataPowerModel.create(data);
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

        const roomRentalDetail = await roomRentalDetailModel.find({ motelRoomID: req.params.id });
        roomRentalDetail.map((item) => {
            roomRentalDetailModel.findOneAndDelete({ _id: item.id });
        })

        const water = await waterModel.find({ motelRoomID: req.params.id });
        water.map((item) => {
            waterModel.findOneAndDelete({ _id: item._id }).exec();
        })

        const datapower = await dataPowerModel.find({ motelRoomID: req.params.id });
        datapower.map((item) => {
            dataPowerModel.findOneAndDelete({ _id: item._id }).exec();
        })

        return AppResponse.success(req, res)(motelRoom);
    }),
    getMotelRoom: asyncUtil(async (req, res) => {
        const motelRoom = await MotelRoomModel.findById({ _id: req.params.id });
        return AppResponse.success(req, res)(motelRoom);
    }),
    statisticalRoomStatus: asyncUtil(async (req, res) => {
        const areRenting = [];
        const emptyRooms = [];
        const rooms = await MotelRoomModel.find({}).populate({
            path: 'motelID',
            select: ['name'],
        });
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
