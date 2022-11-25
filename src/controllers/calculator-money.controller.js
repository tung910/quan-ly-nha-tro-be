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
                            add.totalAmount += serviceItem.unitPrice;
                        }
                    });
                    add.totalAmount += dataPower.useValue * dataPower.price;
                    add.totalAmount += dataWater.useValue * dataWater.price;
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
                        find.totalAmount = 0;
                        const dataPower = await DataPowerModel.findOne({
                            _id: find.dataPowerID,
                        });
                        const dataWater = await DataWaterModel.findOne({
                            _id: find.dataWaterID,
                        });
                        const roomRentalDetail = await RoomRentalDetail.findOne(
                            {
                                _id: find.roomRentalDetailID,
                            }
                        );
                        roomRentalDetail.service.map((serviceItem) => {
                            if (serviceItem.isUse) {
                                find.totalAmount += serviceItem.unitPrice;
                            }
                        });
                        find.totalAmount +=
                            dataPower.useValue * dataPower.price;
                        find.totalAmount +=
                            dataWater.useValue * dataWater.price;
                        find.totalAmount += roomRentalDetail.priceRoom;
                        find.remainAmount = find.totalAmount - find.payAmount;
                        await CalculatorMoneyModel.findByIdAndUpdate(
                            { _id: find._id },
                            find,
                            {
                                new: true,
                            }
                        ).exec();
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
                                add.totalAmount += serviceItem.unitPrice;
                            }
                        });
                        add.totalAmount += dataPower.useValue * dataPower.price;
                        add.totalAmount += dataWater.useValue * dataWater.price;
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
    calculatorAll: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const [day, month, year] = data.date.split('/');
        data.month = month;
        data.year = year;
        const listRoomRental = await RoomRentalDetail.find(data).populate({
            path: 'motelRoomID',
            select: ['motelID'],
        });
        const list = await Promise.all(
            listRoomRental.map(async (i) => {
              var item = {};
                item.month = data.month;
                item.year = data.year;
                item.roomRentalDetailID = i._id;
                item.motelID = i.motelRoomID.motelID;
                dataPower = await DataPowerModel.findOne({
                    motelRoomID: i.motelRoomID._id,
                    month: data.month,
                    year: data.year,
                });
                item.dataPowerID = dataPower._id;
                dataWater = await DataWaterModel.findOne({
                    motelRoomID: i.motelRoomID._id,
                    month: data.month,
                    year: data.year,
                });
                item.dataWaterID = dataWater._id;
                const find = await CalculatorMoneyModel.findOne({
                    roomRentalDetailID: item.roomRentalDetailID,
                });
                if (!find) {
                    const add = await CalculatorMoneyModel.create(item);
                    console.log('add', add.totalAmount);
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
                            add.totalAmount += serviceItem.unitPrice;
                        }
                    });
                    add.totalAmount += dataPower.useValue * dataPower.price;
                    add.totalAmount += dataWater.useValue * dataWater.price;
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
                        find.totalAmount = 0;
                        const dataPower = await DataPowerModel.findOne({
                            _id: find.dataPowerID,
                        });
                        const dataWater = await DataWaterModel.findOne({
                            _id: find.dataWaterID,
                        });
                        const roomRentalDetail = await RoomRentalDetail.findOne(
                            {
                                _id: find.roomRentalDetailID,
                            }
                        );
                        roomRentalDetail.service.map((serviceItem) => {
                            if (serviceItem.isUse) {
                                find.totalAmount += serviceItem.unitPrice;
                            }
                        });
                        find.totalAmount +=
                            dataPower.useValue * dataPower.price;
                        find.totalAmount +=
                            dataWater.useValue * dataWater.price;
                        find.totalAmount += roomRentalDetail.priceRoom;
                        find.remainAmount = find.totalAmount - find.payAmount;
                        await CalculatorMoneyModel.findByIdAndUpdate(
                            { _id: find._id },
                            find,
                            {
                                new: true,
                            }
                        ).exec();
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
                                add.totalAmount += serviceItem.unitPrice;
                            }
                        });
                        add.totalAmount += dataPower.useValue * dataPower.price;
                        add.totalAmount += dataWater.useValue * dataWater.price;
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
        const paymentMoney = await CalculatorMoneyModel.findByIdAndUpdate(
            {
                _id: req.params.id,
            },
            data,
            { new: true }
        );
        return AppResponse.success(req, res)(paymentMoney);
    }),

    sendMailBill: asyncUtil(async (req, res) => {
        const calculator = await CalculatorMoneyModel.find({
            _id: req.params.id,
        }).exec();

        const roomRentalDetailID = calculator[0].roomRentalDetailID;
        const roomRentalDetail = await roomRentalDetailModel.find({
            _id: roomRentalDetailID,
        });
        const email = roomRentalDetail[0].email;
        const motelID = calculator[0].motelID;
        const motel = await motelModel.find({ motelID: motelID });
        const motelName = motel[0].name;
        const month = calculator[0].month;
        const dataWaterID = calculator[0].dataWaterID;
        const dataPowerID = calculator[0].dataPowerID;
        const dataWater = await DataWaterModel.find({ _id: dataWaterID });
        const oldValueWater = dataWater[0].oldValue;
        const newValueWater = dataWater[0].newValue;
        const useValueWater = dataWater[0].useValue;
        const dataPower = await DataPowerModel.find({ _id: dataPowerID });
        const oldValue = dataPower[0].oldValue;
        const newValue = dataPower[0].newValue;
        const useValue = dataPower[0].useValue;
        const unitPrice = 3000;
        const unitPriceWater = 20000;
        const totalPower = useValue * unitPrice;
        const totalWater = useValueWater * unitPriceWater;
        const totalAmount = calculator[0].totalAmount;
        const payAmount = calculator[0].payAmount;
        const remainAmount = calculator[0].remainAmount;
        const total = totalWater + totalPower + totalAmount;

        const formatNumber = (number) => {
            return new Intl.NumberFormat().format(number);
        };

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
                                <td>${formatNumber(oldValue)}</td>
                                <td>${formatNumber(newValue)}</td>
                                <td>${formatNumber(useValue)}</td>
                                <td>${formatNumber(unitPrice)}đ</td>
                                <td>${formatNumber(totalPower)}đ</td>
                            </tr>
                            <tr>
                                <td>Số nước</td>
                                <td>${formatNumber(oldValueWater)}</td>
                                <td>${formatNumber(newValueWater)}</td>
                                <td>${formatNumber(useValueWater)}</td>
                                <td>${formatNumber(unitPriceWater)}đ</td>
                                <td>${formatNumber(totalWater)}đ</td>
                            </tr>
                            <tr>
                                <td>Tiền phòng</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>${formatNumber(totalAmount)}đ</td>
                            </tr>
                            <tr>
                                <td><b>Tổng</b></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><b>${formatNumber(total)}đ</b></td>
                            </tr>
                            <tr>
                                <td><b>Trả Trước(Đã trả)</b></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><b>${formatNumber(payAmount)}đ</b></td>
                            </tr>
                            <tr>
                                <td><b>Còn lại(Chưa trả)</b></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><b>${formatNumber(remainAmount)}đ</b></td>
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
    }),
};
