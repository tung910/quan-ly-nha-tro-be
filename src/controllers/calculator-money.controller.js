const CalculatorMoneyModel = require('~/models/calculator-money.model');
const nodemailer = require('nodemailer');
const DataPowerModel = require('~/models/data-power.model');
const RoomRentalDetail = require('~/models/room-rental-detail.model');
const DataWaterModel = require('~/models/water.model');
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');
const motelModel = require('~/models/motel.model');
const roomRentalDetailModel = require('~/models/room-rental-detail.model');
const motelRoomModel = require('~/models/motel-room.model');

module.exports = {
    calculatorMoney: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const calculator = await CalculatorMoneyModel(data).save();
        return AppResponse.success(req, res)(calculator);
    }),
    listCalculatorMoney: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const motelRoomId = req.query?.roomId;
        let obj = {};
        if (data) {
            obj = {
                ...data,
            };
        }
        if (motelRoomId) {
            obj = {
                ...data,
                motelRoomId,
            };
        }
        const calculators = await CalculatorMoneyModel.find(obj)
            .populate('dataPowerID')
            .populate('dataWaterID')
            .populate('motelID')
            .populate({
                path: 'roomRentalDetailID',
                populate: { path: 'userID', select: ['status', 'message'] },
            })
            .populate({ path: 'motelRoomId', select: ['roomName'] })
            .sort({ createdAt: -1, updatedAt: -1 });
        return AppResponse.success(req, res)(calculators);
    }),
    calculatorAllMoney: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const list = await Promise.all(
            data.map(async (item) => {
                const find = await CalculatorMoneyModel.findOne({
                    roomRentalDetailID: item.roomRentalDetailID,
                    month: item.month,
                    year: item.year,
                });
                const date = new Date(item.year.concat('/', item.month));
                var prevMonth = date.getMonth();
                var prevYear = date.getFullYear();
                if (prevMonth == 0) {
                    prevYear = (prevYear - 1).toString();
                    prevMonth = '12';
                } else {
                    prevMonth = date.getMonth().toString();
                    prevYear = date.getFullYear().toString();
                }
                const prevCalculator = await CalculatorMoneyModel.findOne({
                    roomRentalDetailID: item.roomRentalDetailID,
                    month: prevMonth,
                    year: prevYear,
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
                    const currentDate = new Date();
                    const currentMonth = (
                        currentDate.getMonth() + 1
                    ).toString();
                    const [startDay, startMonth, startYear] =
                        roomRentalDetail.startDate.split('/');
                    roomRentalDetail.service.map((serviceItem) => {
                        if (serviceItem.isUse) {
                            add.totalAmount += serviceItem.unitPrice;
                        }
                    });
                    add.totalAmount += prevCalculator
                        ? prevCalculator.remainAmount
                        : 0;
                    add.previousRemain = prevCalculator
                        ? prevCalculator.remainAmount
                        : 0;
                    add.totalAmount += dataPower.useValue * dataPower.price;
                    add.totalAmount += dataWater.useValue * dataWater.price;
                    if (
                        startDay == '14' ||
                        startDay == '15' ||
                        (startDay == '16' && startMonth == currentMonth)
                    ) {
                        add.totalAmount =
                            add.totalAmount + roomRentalDetail.priceRoom / 2;
                    } else {
                        add.totalAmount += roomRentalDetail.priceRoom;
                    }
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
                } else if (find.paymentStatus == false && find) {
                    find.totalAmount = 0;
                    const dataPower = await DataPowerModel.findOne({
                        _id: find.dataPowerID,
                    });
                    const dataWater = await DataWaterModel.findOne({
                        _id: find.dataWaterID,
                    });
                    const roomRentalDetail = await RoomRentalDetail.findOne({
                        _id: find.roomRentalDetailID,
                    });
                    const currentDate = new Date();
                    const currentMonth = (
                        currentDate.getMonth() + 1
                    ).toString();
                    const [startDay, startMonth, startYear] =
                        roomRentalDetail.startDate.split('/');
                    roomRentalDetail.service.map((serviceItem) => {
                        if (serviceItem.isUse) {
                            find.totalAmount += serviceItem.unitPrice;
                        }
                    });
                    find.totalAmount += prevCalculator
                        ? prevCalculator.remainAmount
                        : 0;
                    find.previousRemain = prevCalculator
                        ? prevCalculator.remainAmount
                        : 0;
                    find.totalAmount += dataPower.useValue * dataPower.price;
                    find.totalAmount += dataWater.useValue * dataWater.price;
                    if (
                        startDay == '14' ||
                        startDay == '15' ||
                        (startDay == '16' && startMonth == currentMonth)
                    ) {
                        find.totalAmount =
                            find.totalAmount + roomRentalDetail.priceRoom / 2;
                    } else {
                        find.totalAmount += roomRentalDetail.priceRoom;
                    }
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
                if (i?.motelRoomID?._id !== undefined) {
                    var item = {};
                    item.month = data.month;
                    item.year = data.year;
                    item.roomRentalDetailID = i._id;
                    item.motelRoomId = i.motelRoomID._id;
                    item.motelID = i.motelRoomID.motelID;
                    item.motelRoomID = i.motelRoomID._id;
                    const date = new Date(item.year.concat('/', item.month));
                    var prevMonth = date.getMonth();
                    var prevYear = date.getFullYear();
                    if (prevMonth == 0) {
                        prevYear = (prevYear - 1).toString();
                        prevMonth = '12';
                    } else {
                        prevMonth = date.getMonth().toString();
                        prevYear = date.getFullYear().toString();
                    }
                    const prevCalculator = await CalculatorMoneyModel.findOne({
                        roomRentalDetailID: item.roomRentalDetailID,
                        month: prevMonth,
                        year: prevYear,
                    });
                    dataPower = await DataPowerModel.findOne({
                        motelRoomID: i.motelRoomID._id,
                        month: data.month,
                        year: data.year,
                    });
                    dataWater = await DataWaterModel.findOne({
                        motelRoomID: i.motelRoomID._id,
                        month: data.month,
                        year: data.year,
                    });
                    if (dataPower && dataPower) {
                        item.dataPowerID = dataPower._id;
                        item.dataWaterID = dataWater._id;
                        const find = await CalculatorMoneyModel.findOne({
                            roomRentalDetailID: item.roomRentalDetailID,
                            month: item.month,
                            year: item.year,
                        });
                        if (!find) {
                            const add = await CalculatorMoneyModel.create(item);
                            // const dataPower = await DataPowerModel.findOne({
                            //     _id: add.dataPowerID,
                            // });
                            // const dataWater = await DataWaterModel.findOne({
                            //     _id: add.dataWaterID,
                            // });
                            const roomRentalDetail =
                                await RoomRentalDetail.findOne({
                                    _id: add.roomRentalDetailID,
                                });
                            const currentDate = new Date();
                            const currentMonth = (
                                currentDate.getMonth() + 1
                            ).toString();
                            const [startDay, startMonth, startYear] =
                                roomRentalDetail.startDate.split('/');
                            roomRentalDetail.service.map((serviceItem) => {
                                if (serviceItem.isUse) {
                                    add.totalAmount += serviceItem.unitPrice;
                                }
                            });
                            add.totalAmount += prevCalculator
                                ? prevCalculator.remainAmount
                                : 0;
                            add.previousRemain = prevCalculator
                                ? prevCalculator.remainAmount
                                : 0;
                            add.totalAmount +=
                                dataPower.useValue * dataPower.price;
                            add.totalAmount +=
                                dataWater.useValue * dataWater.price;
                            if (
                                startDay == '14' ||
                                startDay == '15' ||
                                (startDay == '16' && startMonth == currentMonth)
                            ) {
                                add.totalAmount =
                                    add.totalAmount +
                                    roomRentalDetail.priceRoom / 2;
                            } else {
                                add.totalAmount += roomRentalDetail.priceRoom;
                            }
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
                        } else if (find.paymentStatus == false && find) {
                            find.totalAmount = 0;
                            // const dataPower = await DataPowerModel.findOne({
                            //     _id: find.dataPowerID,
                            // });
                            // const dataWater = await DataWaterModel.findOne({
                            //     _id: find.dataWaterID,
                            // });
                            const roomRentalDetail =
                                await RoomRentalDetail.findOne({
                                    _id: find.roomRentalDetailID,
                                });
                            const currentDate = new Date();
                            const currentMonth = (
                                currentDate.getMonth() + 1
                            ).toString();
                            const [startDay, startMonth, startYear] =
                                roomRentalDetail.startDate.split('/');
                            roomRentalDetail.service.map((serviceItem) => {
                                if (serviceItem.isUse) {
                                    find.totalAmount += serviceItem.unitPrice;
                                }
                            });
                            find.totalAmount += prevCalculator
                                ? prevCalculator.remainAmount
                                : 0;
                            find.previousRemain = prevCalculator
                                ? prevCalculator.remainAmount
                                : 0;
                            find.totalAmount +=
                                dataPower.useValue * dataPower.price;
                            find.totalAmount +=
                                dataWater.useValue * dataWater.price;
                            if (
                                startDay == '14' ||
                                startDay == '15' ||
                                (startDay == '16' && startMonth == currentMonth)
                            ) {
                                find.totalAmount =
                                    find.totalAmount +
                                    roomRentalDetail.priceRoom / 2;
                            } else {
                                find.totalAmount += roomRentalDetail.priceRoom;
                            }
                            find.payAmount =
                                find.payAmount > find.totalAmount
                                    ? find.totalAmount
                                    : find.payAmount;
                            find.remainAmount =
                                find.totalAmount - find.payAmount > 0
                                    ? find.totalAmount - find.payAmount
                                    : 0;
                            find.paymentStatus =
                                find.remainAmount == 0 ? true : false;
                            await CalculatorMoneyModel.findByIdAndUpdate(
                                { _id: find._id },
                                find,
                                {
                                    new: true,
                                }
                            ).exec();
                            item = find;
                            return item;
                        }
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

        console.log(roomRentalDetail[0]);
        const motelRoomID = roomRentalDetailID.motelRoomID;
        const MotelRoom = await motelRoomModel.findOne({
            motelRoomID: motelRoomID,
        });
        const unitPriceRoom = MotelRoom.unitPrice;
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
        const unitPrice = dataPower[0].price;
        const unitPriceWater = dataWater[0].price;
        const totalPower = useValue * unitPrice;
        const totalWater = useValueWater * unitPriceWater;
        const totalAmount = calculator[0].totalAmount;
        const payAmount = calculator[0].payAmount;
        const remainAmount = calculator[0].remainAmount;

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
                subject: 'TR??? V????NG ANH XIN CH??O!',
                html: `
                <h2>H??a ????n Ti???n Nh??</h2>
                <h4>Nh?? ${motelName}</h4>
                <h4>Th??ng ${month}</h4>
                <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>S??? c??</th>
                                <th>S??? m???i</th>
                                <th>S??? ti??u th???</th>
                                <th>????n gi??</th>
                                <th>T???ng</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>S??? ??i???n</td>
                                <td>${formatNumber(oldValue)}</td>
                                <td>${formatNumber(newValue)}</td>
                                <td>${formatNumber(useValue)}</td>
                                <td>${formatNumber(unitPrice)}??</td>
                                <td>${formatNumber(totalPower)}??</td>
                            </tr>
                            <tr>
                                <td>S??? n?????c</td>
                                <td>${formatNumber(oldValueWater)}</td>
                                <td>${formatNumber(newValueWater)}</td>
                                <td>${formatNumber(useValueWater)}</td>
                                <td>${formatNumber(unitPriceWater)}??</td>
                                <td>${formatNumber(totalWater)}??</td>
                            </tr>
                            <tr>
                                <td>Ti???n ph??ng</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>${formatNumber(unitPriceRoom)}??</td>
                            </tr>
                            <tr>
                                <td><b>T???ng</b></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><b>${formatNumber(totalAmount)}??</b></td>
                            </tr>
                            <tr>
                                <td><b>Tr??? Tr?????c(???? tr???)</b></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><b>${formatNumber(payAmount)}??</b></td>
                            </tr>
                            <tr>
                                <td><b>C??n l???i(Ch??a tr???)</b></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td><b style="color:red">${formatNumber(
                                    remainAmount
                                )}??</b></td>
                            </tr>
                        </tbody>
                </table>`,
            },
            (error) => {
                if (error) return AppResponse.fail(error, res);
            }
        );

        const data = { total: totalAmount };
        return AppResponse.success(req, res)(data);
    }),

    paymentVNPay: asyncUtil(async (req, res) => {
        const dateFormat = require('dateformat');
        const {
            amount,
            bankCode,
            orderInfo,
            orderType,
            locale = 'vn',
        } = req.body;
        const ipAddr =
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        const date = new Date();
        const createDate = dateFormat(date, 'yyyymmddHHmmss');
        const orderId = dateFormat(date, 'HHmmss');
        const currCode = 'VND';
        let vnpUrl = process.env.VNP_URL;
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = process.env.VNP_TMNCODE;
        // vnp_Params['vnp_Merchant'] = ''
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_OrderType'] = orderType;
        vnp_Params['vnp_Amount'] = +amount * 100;
        vnp_Params['vnp_ReturnUrl'] = process.env.VNP_RETURNURL;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }
        vnp_Params = sortObject(vnp_Params);

        const querystring = require('qs');
        const signData = querystring.stringify(vnp_Params, { encode: false });
        const crypto = require('crypto');
        const hmac = crypto.createHmac('sha512', process.env.VNP_HASHSECRET);
        const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
        return AppResponse.success(req, res)(vnpUrl);
    }),
    VNPayReturn: asyncUtil(async (req, res) => {
        var vnp_Params = req.query;
        var secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);

        var tmnCode = process.env.VNP_TMNCODE;
        var secretKey = process.env.VNP_HASHSECRET;

        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require('crypto');
        var hmac = crypto.createHmac('sha512', secretKey);
        var signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
        if (secureHash === signed) {
            // res.writeHead(301, { Location: urlReturn });
            // return res.end();
            AppResponse.success(
                req,
                res
            )({ code: vnp_Params['vnp_ResponseCode'], result: vnp_Params });
        } else {
            AppResponse.success(req, res, 97)(null);
        }
    }),
    VNPayIPN: asyncUtil(async (req, res) => {
        var vnp_Params = req.query;
        var secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);
        var secretKey = process.env.VNP_HASHSECRET;
        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require('crypto');
        var hmac = crypto.createHmac('sha512', secretKey);
        var signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

        if (secureHash === signed) {
            var orderId = vnp_Params['vnp_TxnRef'];
            var rspCode = vnp_Params['vnp_ResponseCode'];
            //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
            res.status(200).json({ RspCode: '00', Message: 'success' });
        } else {
            res.status(200).json({ RspCode: '97', Message: 'Fail checksum' });
        }
    }),
    sendEmailPaymentSuccess: asyncUtil(async (req, res) => {
        const {
            email,
            name,
            roomName,
            payType,
            priceRoom,
            date,
            payer,
            orderId,
        } = req.body;
        const room = roomName.split('-')[1];
        const motel = roomName.split('-')[0];

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
                to: process.env.EMAIL_ADMIN,
                subject: 'TR??? V????NG ANH XIN CH??O!',
                html: `<h3>H??a ????n #${orderId} thanh to??n th??nh c??ng</h3>
                <p>Kh??ch h??ng:<b> ${name}</b></p>  
                <p>Ng?????i thanh to??n:<b> ${payer}</b></p>  
                <p>Email: <b>${email}</b></p>  
                <p>Nh??: <b>${motel}</b> Ph??ng: <b>${room}</b></p>   
                <h4><b>???? thanh to??n th??nh c??ng ti???n tr??? th??ng ${date} v???i s??? ti???n l?? ${priceRoom} </b></h4>
                <p>Ph????ng th???c thanh to??n l?? ${payType}</p>
                `,
            },
            (error) => {
                if (error) return AppResponse.fail(error);
            }
        );
        return AppResponse.success(req, res)(null);
    }),
};
function sortObject(obj) {
    var sorted = {};
    var str = [];
    var key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(
            /%20/g,
            '+'
        );
    }
    return sorted;
}
