const RoomRentalDetail = require('~/models/room-rental-detail.model');
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');
const MotelRoomModel = require('~/models/motel-room.model');
const DataPowerModel = require('~/models/data-power.model');
const DataWaterModel = require('~/models/water.model');
const CalculatorMoneyModel = require('~/models/calculator-money.model');
const roomRentalDetailModel = require('~/models/room-rental-detail.model');

module.exports = {
    createRoomRentalDetail: asyncUtil(async (req, res) => {
        const {
            data: { CustomerInfo, Member, Service, Contract },
        } = req.body;
        const roomRentalDetail = await RoomRentalDetail({
            ...CustomerInfo,
            service: Service,
            member: Member,
        }).save();
        await DataPowerModel.findOneAndUpdate(
            { roomName: CustomerInfo.roomName },
            { customerName: CustomerInfo.customerName }
        ).exec();
        await DataWaterModel.findOneAndUpdate(
            { roomName: CustomerInfo.roomName },
            {
                customerName: CustomerInfo.customerName,
            }
        ).exec();
        await MotelRoomModel.findByIdAndUpdate(
            { _id: CustomerInfo.motelRoomID },
            {
                isRent: true,
                customerName: CustomerInfo.customerName,
                roomRentID: roomRentalDetail._id,
            }
        ).exec();
        return AppResponse.success(req, res)(roomRentalDetail);
    }),
    getAllRoomRentalDetail: asyncUtil(async (req, res) => {
        const roomRentalDetail = await RoomRentalDetail.find({});
        return AppResponse.success(req, res)(roomRentalDetail);
    }),
    deleteRoomRentalDetail: asyncUtil(async (req, res) => {
        const roomRentalDetail = await RoomRentalDetail.findOneAndDelete({
            _id: req.params.id,
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
        const {
            data: { CustomerInfo, Member, Service, Contract },
        } = req.body;
        if (CustomerInfo == '' || CustomerInfo == null) {
            console.log('yêu cầu nhập đủ thông tin!');
            const msg = 'yêu cầu nhập đủ thông tin!';
            return AppResponse.fail(req, res)(msg);
        }
        const roomRentalDetail = await RoomRentalDetail.findOneAndUpdate(
            {
                _id: req.params.id,
            },
            {
                ...CustomerInfo,
                service: Service,
                member: Member,
            },
            { new: true }
        ).exec();
        await DataPowerModel.findOneAndUpdate(
            { roomName: CustomerInfo.roomName },
            { customerName: CustomerInfo.customerName }
        ).exec();
        await DataWaterModel.findOneAndUpdate(
            { roomName: CustomerInfo.roomName },
            {
                customerName: CustomerInfo.customerName,
            }
        ).exec();
        await MotelRoomModel.findByIdAndUpdate(
            { _id: CustomerInfo.motelRoomID },
            {
                isRent: true,
                customerName: CustomerInfo.customerName,
                roomRentID: roomRentalDetail._id,
            }
        ).exec();
        return AppResponse.success(req, res)(roomRentalDetail);
    }),
};
