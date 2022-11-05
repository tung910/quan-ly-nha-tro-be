const RevenueStatisticsModel = require('~/models/revenue-statistics.models');
const CalculatorMoneyModel = require('~/models/calculator-money.model');
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');

module.exports = {
    listRevenueStatistics: asyncUtil(async (req, res) => {
        const revenueStatistics = await RevenueStatisticsModel.find({});

        return AppResponse.success(req, res)(revenueStatistics);
    }),
    addOrUpdate: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const existTotalPayment = await RevenueStatisticsModel.findOne({
            month: data.month,
        });
        let obj = {};
        obj.month = data.month;
        obj.year = data.year;
        obj.totalPaymentAmount = 0;
        obj.totalPaymentUnpaid = 0;
        obj.totalBillPaid = 0;
        obj.totalBillUnpaid = 0;
        const listBill = await CalculatorMoneyModel.find({ month: data.month });
        obj.totalBill = listBill.length;
        listBill.map((item) => {
            obj.totalPaymentAmount += item.payAmount;
            obj.totalPaymentUnpaid += item.remainAmount;
            if (item.paymentStatus) {
                obj.totalBillPaid++;
            } else {
                obj.totalBillUnpaid++;
            }
        });
        console.log('obj', obj);
        // console.log('listBill', listBill);
        if (existTotalPayment) {
            updateTotalPayment = await RevenueStatisticsModel.findOneAndUpdate(
                {
                    month: data.month,
                },
                { obj }
            );
            return AppResponse.success(req, res)(updateTotalPayment);
        } else {
            addTotalPayment = await RevenueStatisticsModel.create(obj);
            return AppResponse.success(req, res)(addTotalPayment);
        }
        // const revenueStatistics = await RevenueStatisticsModel.create(data);
    }),
    getTotalPayment: asyncUtil(async (req, res) => {
        const { data } = req.body;
        let obj = {};
        if (data) {
            obj = data;
        }
        const revenueStatistics = await RevenueStatisticsModel.findOne({ obj });

        return AppResponse.success(req, res)(revenueStatistics);
    }),
    monthlyRevenue: asyncUtil(async (req, res) => {
        const { data } = req.body;
        let options = {};
        if (data) {
            options = {
                year: data.year,
            };
        }
        const revenueStatistics = await RevenueStatisticsModel?.find(
            options
        )?.sort({
            month: 1,
        });

        return AppResponse.success(req, res)(revenueStatistics);
    }),
};
