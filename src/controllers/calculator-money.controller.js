const CalculatorMoneyModel = require('~/models/calculator-money.model');
const MotelRoomModel = require('~/models/motel-room.model');
const nodemailer = require('nodemailer');
const DataPowerModel = require('~/models/data-power.model');
const RoomRentalDetail = require('~/models/room-rental-detail.model');
const DataWaterModel = require('~/models/water.model');
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');

module.exports = {
    calculatorMoney: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const calculator = await CalculatorMoneyModel(data).save();
        return AppResponse.success(req, res)(calculator);
    }),

    listCalculatorMoney: asyncUtil(async (req, res) => {
        const { data } = req.body;
        let obj = {};
        if (data) {
            obj = data;
        }
        const calculators = await CalculatorMoneyModel.find(obj)
            .populate('dataPowerID')
            .populate('dataWaterID')
            .populate('motelID')
            .populate('roomRentalDetailID');
        return AppResponse.success(req, res)(calculators);
    }),
    calculatorAllMoney: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const list = await Promise.all(
            data.map(async (item) => {
                const find = await CalculatorMoneyModel.findOne({
                    roomRentalDetailID: item.roomRentalDetailID,
                });
                if (!find) {
                    const add = await CalculatorMoneyModel.create(item);
                    const dataPower = await DataPowerModel.findOne({
                        _id: add.dataPowerID,
                    });
                    const dataWater = await DataWaterModel.findOne({
                        _id: add.dataWaterID,
                    });
                    const roomRentalDetail = await RoomRentalDetail.findOne({
                        _id: add.roomRentalDetailID,
                    });
                    roomRentalDetail.service.map((serviceItem) => {
                        if (serviceItem.isUse) {
                            serviceItem.serviceName === 'Nước'
                                ? (add.totalAmount +=
                                    dataWater.useValue *
                                    serviceItem.unitPrice)
                                : serviceItem.serviceName === 'Điện'
                                    ? (add.totalAmount +=
                                        dataPower.useValue *
                                        serviceItem.unitPrice)
                                    : (add.totalAmount += serviceItem.unitPrice);
                        }
                    });
                    add.totalAmount += roomRentalDetail.priceRoom;
                    add.remainAmount = add.totalAmount;
                    await CalculatorMoneyModel.findByIdAndUpdate(
                        { _id: add._id },
                        add,
                        {
                            new: true,
                        }
                    ).exec();
                    item = add;
                    return item;
                } else {
                    if (find.month === item.month) {
                        item = find;
                        return item;
                    } else {
                        const add = await CalculatorMoneyModel.create(item);
                        const dataPower = await DataPowerModel.findOne({
                            _id: add.dataPowerID,
                        });
                        const dataWater = await DataWaterModel.findOne({
                            _id: add.dataWaterID,
                        });
                        const roomRentalDetail = await RoomRentalDetail.findOne(
                            {
                                _id: add.roomRentalDetailID,
                            }
                        );
                        roomRentalDetail.service.map((serviceItem) => {
                            if (serviceItem.isUse) {
                                serviceItem.serviceName === 'Nước'
                                    ? (add.totalAmount +=
                                        dataWater.useValue *
                                        serviceItem.unitPrice)
                                    : serviceItem.serviceName === 'Điện'
                                        ? (add.totalAmount +=
                                            dataPower.useValue *
                                            serviceItem.unitPrice)
                                        : (add.totalAmount +=
                                            serviceItem.unitPrice);
                            }
                        });
                        add.totalAmount += roomRentalDetail.priceRoom;
                        add.remainAmount = add.totalAmount;
                        await CalculatorMoneyModel.findByIdAndUpdate(
                            { _id: add._id },
                            add,
                            {
                                new: true,
                            }
                        ).exec();
                        item = add;
                        return item;
                    }
                }
            })
        );
        return AppResponse.success(req, res)(list);
    }),

    detailCalculator: asyncUtil(async (req, res) => {
        const calculator = await CalculatorMoneyModel.find({
            _id: req.params.id,
        })

            .populate({
                path: 'dataPowerID',
                select: ['useValue', 'oldValue', 'newValue'],
            })
            .populate({
                path: 'dataWaterID',
                populate: { path: 'motelID', select: 'name' },
                select: ['useValue', 'oldValue', 'newValue'],
            })
            .populate({
                path: 'roomRentalDetailID',
                select: ['service', 'customerName', 'roomName', 'priceRoom'],
            });

        console.log('cacalculator',calculator);
        return AppResponse.success(req, res)(calculator);
    }),
};
