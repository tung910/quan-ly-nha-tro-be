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
        const obj = {};
        const listBill = await CalculatorMoneyModel.find({ month: data.month });
        obj.totalBill = listBill.length
        listBill.map((item) => {
          obj.totalPaymentAmount += item.payAmount;
          obj.totalPaymentUnpaid += item.remainAmount;
            if (item.paymentStatus) {
                obj.totalBillPaid++;
            } else {
                obj.totalBillUnpaid++;
            }
        });
        console.log("obj",obj)
        console.log('listBill', listBill);
        // if (existTotalPayment) {
        //     updateTotalPayment = await RevenueStatisticsModel.findOneAndUpdate(
        //         {
        //             month: data.month,
        //         },
        //         {}
        //     );
        // }
        // const revenueStatistics = await RevenueStatisticsModel.create(data);

        return AppResponse.success(req, res)(listBill);
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
};
