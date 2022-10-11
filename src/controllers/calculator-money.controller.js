const CalculatorMoneyModel = require('~/models/calculator-money.model');
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');

module.exports = {
    calculatorMoney: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const calculator = await CalculatorMoneyModel(data).save();
        return AppResponse.success(req, res)(calculator);
    }),

    listCalculatorMoney: asyncUtil(async (req, res) => {
        const calculators = await CalculatorMoneyModel.find({})
            .populate('dataPowerID')
            .populate([
                'dataWaterID',
                {
                    path: 'dataWaterID',
                    populate: { path: 'motelID', select: 'name' },
                },
            ])
            .populate('roomRentalDetailID');
        return AppResponse.success(req, res)(calculators);
    }),
    calculatorAllMoney: asyncUtil(async (req, res) => {
        const list = await CalculatorMoneyModel.find({})
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
        list.map(async (item) => {
            if (item.totalAmount === 0) {
                item.roomRentalDetailID.service.map((serviceItem) => {
                    if (serviceItem.isUse) {
                        serviceItem.serviceName === 'Nước'
                            ? (item.totalAmount +=
                                  item.dataWaterID.useValue *
                                  serviceItem.unitPrice)
                            : serviceItem.serviceName === 'Điện'
                            ? (item.totalAmount +=
                                  item.dataPowerID.useValue *
                                  serviceItem.unitPrice)
                            : (item.totalAmount += serviceItem.unitPrice);
                    }
                });
                item.totalAmount += item.roomRentalDetailID.priceRoom;
                item.remainAmount = item.totalAmount;

                await CalculatorMoneyModel.findByIdAndUpdate(
                    { _id: item._id },
                    item,
                    { new: true }
                ).exec();
            }
        });
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
};
