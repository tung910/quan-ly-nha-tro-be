const RevenueStatisticsModel = require('~/models/revenue-statistics.models');
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');

module.exports = {
    listRevenueStatistics: asyncUtil(async (req, res) => {
        const revenueStatistics = await RevenueStatisticsModel.find({});

        return AppResponse.success(req, res)(revenueStatistics);
    }),
    addTotalPayment: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const revenueStatistics = await RevenueStatisticsModel.create(data);

        return AppResponse.success(req, res)(revenueStatistics);
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
