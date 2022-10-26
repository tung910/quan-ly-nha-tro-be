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
const roomRentalDetailModel = require('~/models/room-rental-detail.model');

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
        return AppResponse.success(req, res)(paymentMoney);
    }),


    sendMailBill: asyncUtil(async (req, res) => {

        const calculator = await CalculatorMoneyModel.find({
            _id: req.params.id,
        }).exec();

        const roomRentalDetailID = calculator[0].roomRentalDetailID;
        const roomRentalDetail = await roomRentalDetailModel.find({ _id: roomRentalDetailID });
        const email = roomRentalDetail[0].email;
        const motelID = calculator[0].motelID;
        const motel = await motelModel.find({ motelID: motelID });
        const motelName = motel[0].name;
        const month = calculator[0].month;
        const dataWaterID = calculator[0].dataWaterID;
        const dataPowerID = calculator[0].dataPowerID;
        const dataWater = await DataWaterModel.find({ _id: dataWaterID })
        const oldValueWater = dataWater[0].oldValue;
        const newValueWater = dataWater[0].newValue;
        const useValueWater = dataWater[0].useValue;
        const unitPriceWater = 20000;
        const totalWater = useValueWater * unitPriceWater;
        const dataPower = await DataPowerModel.find({ _id: dataPowerID })
        const oldValue = dataPower[0].oldValue;
        const newValue = dataPower[0].newValue;
        const useValue = dataPower[0].useValue;
        const unitPrice = 3000;
        const totalPower = useValue * unitPrice;
        const totalAmount = calculator[0].totalAmount;
        const total = totalWater + totalPower + totalAmount;

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_APP,
                pass: process.env.PASS_APP,
            },
        });

        await transporter.sendMail(
            {
                from: process.env.EMAIL_APP,
                to: `${email}`,
                subject: 'TRỌ VƯƠNG ANH XIN CHÀO!',
                html: `
                <h2>Hóa Đơn Tiền Nhà</h2>
                <h4>Nhà ${motelName}</h4>
                <h4>Tháng ${month}</h4>
                <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Số cũ</th>
                                <th>Số mới</th>
                                <th>Số tiêu thụ</th>
                                <th>Đơn giá</th>
                                <th>Tổng</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Số điện</td>
                                <td>${oldValue}</td>
                                <td>${newValue}</td>
                                <td>${useValue}</td>
                                <td>${unitPrice}đ</td>
                                <td>${totalPower}đ</td>
                            </tr>
                            <tr>
                                <td>Số nước</td>
                                <td>${oldValueWater}</td>
                                <td>${newValueWater}</td>
                                <td>${useValueWater}</td>
                                <td>${unitPriceWater}đ</td>
                                <td>${totalWater}đ</td>
                            </tr>
                            <tr>
                                <td>Tiền phòng</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>${totalAmount}đ</td>
                            </tr>
                            <tr>
                                <td><b>Tổng</b></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><b>${total}đ</b></td>
                            </tr>
                        </tbody>
                </table>`,
            },
            (error) => {
                if (error) return AppResponse.fail(error, res);
            }
        );

        const data = { total: total };
        return AppResponse.success(req, res)(data);
    })
};
