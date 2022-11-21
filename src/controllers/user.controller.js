const UserModel = require('~/models/user.model');
const DataPowerModel = require('~/models/data-power.model');
const DataWaterModel = require('~/models/water.model');
const CalculatorMoneyModel = require('~/models/calculator-money.model');
const asyncUtil = require('~/helpers/asyncUtil');
const bcrypt = require('bcrypt');
const AppResponse = require('~/helpers/response');

module.exports = {
    getAllUsers: asyncUtil(async (req, res) => {
        const users = await UserModel.find({})
            .populate({
                path: 'motelRoomID',
                populate: { path: 'motelID', select: 'name' },
                select: ['roomName', 'customerName'],
            })
            .exec();
        return AppResponse.success(req, res)(users);
    }),
    getUser: asyncUtil(async (req, res) => {
        var result = {};
        const today = new Date();
        const currentMonth = (today.getMonth() + 1).toString();
        const currentYear = today.getFullYear().toString();
        var user = await UserModel.findById({ _id: req.params.id })
            .populate({
                path: 'motelRoomID',
                populate: { path: 'motelID', select: 'name' },
                select: ['roomName', 'customerName', 'images', 'roomRentID'],
            })
            .exec();
        const dataPower = await DataPowerModel.findOne({
            month: currentMonth,
            motelRoomID: user.motelRoomID,
            year: currentYear,
        });
        const dataWater = await DataWaterModel.findOne({
            motelRoomID: user.motelRoomID,
            month: currentMonth,
            year: currentYear,
        });
        const bill = await CalculatorMoneyModel.findOne({
            roomRentalDetailID: user.motelRoomID.roomRentID,
            month: currentMonth,
            year: currentYear,
        });
        if (bill) {
            result.bill = bill;
        }
        result.user = user;
        if (dataPower) {
            result.power = {
                useValue: dataPower.useValue,
                newValue: dataPower.newValue,
                oldValue: dataPower.oldValue,
            };
        }
        if (dataWater) {
            result.water = {
                useValue: dataWater.useValue,
                newValue: dataWater.newValue,
                oldValue: dataWater.oldValue,
            };
        }
        return AppResponse.success(req, res)(result);
    }),
    deleteUser: asyncUtil(async (req, res) => {
        const user = await UserModel.findByIdAndDelete({ _id: req.params.id });
        return AppResponse.success(req, res)(user);
    }),
    updatePassword: asyncUtil(async (req, res) => {
        // const { password } = req.body;
        req.body.password = await bcrypt.hash(req.body.password, 10);
        const user = await UserModel.findByIdAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );
        return AppResponse.success(req, res)(user);
    }),
};
