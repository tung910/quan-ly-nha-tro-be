const MotelRoomModel = require('~/models/motel-room.model');
const DataPowerModel = require('~/models/data-power.model');
const DataWaterModel = require('~/models/water.model');
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');
const roomRentalDetailModel = require('~/models/room-rental-detail.model');
const CalculatorMoneyModel = require('~/models/calculator-money.model');
const waterModel = require('~/models/water.model');
const dataPowerModel = require('~/models/data-power.model');

module.exports = {
    getAllMotelRoom: asyncUtil(async (req, res) => {
        let options = {};
        const roomId = req?.query?.roomId;
        const isRent = req?.query?.isRent;

        if (roomId) {
            options = { ...options, motelID: roomId };
        }
        if (isRent) {
            options = { ...options, isRent: isRent };
        }
        const motelRoom = await MotelRoomModel.find(options);
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
        const roomRentalDetail = await roomRentalDetailModel.find({
            motelRoomID: req.params.id,
        });
        roomRentalDetail.map((item) => {
            roomRentalDetailModel.findOneAndDelete({ _id: item._id }).exec();
        });
        const water = await waterModel.find({ motelRoomID: req.params.id });
        water.map((item) => {
            waterModel.findOneAndDelete({ _id: item._id }).exec();
        });

        const datapower = await dataPowerModel.find({
            motelRoomID: req.params.id,
        });
        datapower.map((item) => {
            dataPowerModel.findOneAndDelete({ _id: item._id }).exec();
        });

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
    payHostel: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const calculator = await CalculatorMoneyModel.findOne({
            month: data.month,
            year: data.year,
            roomRentalDetailID: data.roomRentID,
        });
        if (calculator) {
            if (calculator.totalAmount !== 0 && calculator.remainAmount == 0) {
                await DataPowerModel.findOneAndUpdate(
                    { motelRoomID: data._id },
                    {
                        customerName: '',
                        month: data.month,
                        year: data.year,
                    }
                ).exec();
                await DataWaterModel.findOneAndUpdate(
                    { motelRoomID: data._id },
                    {
                        customerName: '',
                        month: data.month,
                        year: data.year,
                    }
                ).exec();
                const motelRoom = await MotelRoomModel.findOneAndUpdate(
                    {
                        _id: data._id,
                    },
                    {
                        isRent: false,
                        isDebit: false,
                        customerName: '',
                        lease: [],
                        avatarCustomer:
                            'https://res.cloudinary.com/dhfndew6y/image/upload/v1666108397/upload-by-nodejs/kbd0oqh53vnet31epfdf.png',
                    },
                    { new: true }
                ).exec();
                await roomRentalDetailModel.findByIdAndDelete({
                    _id: data.roomRentID,
                });
                await CalculatorMoneyModel.findOneAndDelete({
                    month: data.month,
                    year: data.year,
                    roomRentalDetailID: data.roomRentID,
                });
                return AppResponse.success(req, res)(motelRoom);
            } else {
                return AppResponse.fail(
                    req,
                    res,
                    400
                )(
                    null,
                    'Phải thanh toán trước khi trả phòng'
                );
            }
        } else {
            return AppResponse.fail(
                req,
                res,
                400
            )(null, 'Phải tính tiền phòng');
        }
    }),
};
