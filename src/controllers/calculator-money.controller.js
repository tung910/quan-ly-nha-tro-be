const CalculatorMoneyModel = require('~/models/calculator-money.model');
const RevenueStatisticsModel = require('~/models/revenue-statistics.models');
const MotelRoomModel = require('~/models/motel-room.model');
const nodemailer = require('nodemailer');
const DataPowerModel = require('~/models/data-power.model');
const RoomRentalDetail = require('~/models/room-rental-detail.model');
const DataWaterModel = require('~/models/water.model');
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');
const motelModel = require('~/models/motel.model');
const serviceModel = require('~/models/service.model');
const dataPowerModel = require('~/models/data-power.model');

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
        return AppResponse.success(req, res)(calculator);
    }),

    deleteCalculator: asyncUtil(async (req, res) => {
        const calculator = await CalculatorMoneyModel.findByIdAndDelete({
            _id: req.params.id,
        });
        return AppResponse.success(req, res)(calculator);
    }),
    paymentMoney: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const paymentMoney = await CalculatorMoneyModel.findByIdAndUpdate({
            _id: req.params.id,
        }, data, { new: true });
        await RevenueStatisticsModel.create(data)
        return AppResponse.success(req, res)(paymentMoney);
    }),


    sendMailBill: asyncUtil(async (req, res) => {
        return console.log(req.params.id);

        const calculator = await CalculatorMoneyModel.find({
            _id: req.params.id,
        })

        const roomRentalDetail = await RoomRentalDetail.find({ _id: calculator[0].roomRentalDetailID });


        // lấy tên phòng ok
        const motelID = calculator[0].motelID;
        // console.log('Motel id: =>',motelID);
        const motel = await motelModel.find({ motelID: motelID });
        const motelName = motel[0].name;

        // lấy tháng thanh toán ok
        const month = calculator[0].month;

        //lấy dịch vụ, tiền nhà
        // lấy tên vs số tiêu thu Nước
        const dataWaterID = calculator[0].dataWaterID;

        const dataWater = await DataWaterModel.find({ motelID: motelID })
        const oldValue = dataWater[0].oldValue;
        const newValue = dataWater[0].newValue;
        const useValue = dataWater[0].useValue;

        // const dataWater = await DataPowerModel.find({ dataPowerID: dataWaterID })
        // const oldValue = dataWater[0].oldValue;
        // const newValue = dataWater[0].newValue;
        // const useValue = dataWater[0].useValue;


        console.log(oldValue, newValue, useValue);

        const dataPowerID = calculator[0].dataPowerID;
        // const dataPower = DataPowerModel

        // tính tổng
        const totalAmount = calculator[0].totalAmount;
        //send to email
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_APP,
                pass: process.env.PASS_APP,
            },
        });

        return;
        await transporter.sendMail(
            {
                from: process.env.EMAIL_APP,
                to: `${email}`,
                subject: 'TRỌ VƯƠNG ANH XIN CHÀO!',
                html: `
                <h2>Hóa Đơn Tiền Nhà</h2>
                <h4>Phòng ${motelName}</h4>
                <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tháng</th>
                                <th>Số điện tiêu thụ</th>
                                <th>Số nước tiêu thụ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>${month}</td>
                                <td>Số cũ ${oldValue}/ Số mới: ${newValue}/ Sử dụng:${useValue}</td>
                                <td>${month}</td>
                                <td>${month}</td>
                            </tr>
                            <tr>
                                <td><b>Tổng</b></td>
                                <td>${totalAmount}đ</td>
                            </tr>
                        </tbody>
                </table>`,
            },
            (error) => {
                if (error) return AppResponse.fail(error, res);
            }
        );
    })
};
