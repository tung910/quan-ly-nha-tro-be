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
            year: data.year,
        });
        let obj = {};
        obj.month = data.month;
        obj.year = data.year;
        obj.totalPaymentAmount = 0;
        obj.totalPaymentUnpaid = 0;
        obj.totalBillPaid = 0;
        obj.totalBillUnpaid = 0;
        const listBill = await CalculatorMoneyModel.find({
            month: data.month,
            year: data.year,
        });
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
        if (existTotalPayment) {
            updateTotalPayment = await RevenueStatisticsModel.findOneAndUpdate(
                {
                    month: data.month,
                    year: data.year,
                },
                obj,
                { new: true }
            );
            return AppResponse.success(req, res)(updateTotalPayment);
        } else {
            addTotalPayment = await RevenueStatisticsModel.create(obj);
            return AppResponse.success(req, res)(addTotalPayment);
        }
    }),
    getTotalPayment: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const [month, year] = data.date.split('/');
        data.month = month;
        data.year = year;
        let obj = {};
        if (data) {
            obj = data;
        }
        const revenueStatistics = await RevenueStatisticsModel.findOne(obj);

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
