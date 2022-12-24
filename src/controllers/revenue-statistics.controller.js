const RevenueStatisticsModel = require('~/models/revenue-statistics.models');
const UserModel = require('~/models/user.model');
const RoomRentalDetail = require('~/models/room-rental-detail.model');
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
        await forLoop(listBill, obj, data);
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
const forLoop = async (listBill, obj, data) => {
    const listBillLength = listBill.length;
    for (let index = 0; index < listBill.length; index++) {
        const bill = listBill[index];
        const roomRentalDetail = await RoomRentalDetail.findOne({
            _id: bill.roomRentalDetailID,
        });
        obj.totalPaymentAmount += bill.payAmount;
        obj.totalPaymentUnpaid += bill.remainAmount;
        if (bill.paymentStatus) {
            obj.totalBillPaid++;
        } else {
            obj.totalBillUnpaid++;
        }
        const user = await UserModel.findById({ _id: roomRentalDetail.userID });
        if (!user.status) {
            continue;
        }
        const [startDay, startMonth, startYear] =
            roomRentalDetail.startDate.split('/');
        if (startMonth == data.month && startYear == data.year) {
            obj.totalPaymentAmount += roomRentalDetail.deposit
                ? roomRentalDetail.deposit
                : 0;
        }
    }
    // listBill.map(async (item) => {
    // const roomRentalDetail = await RoomRentalDetail.findOne({
    //     _id: item.roomRentalDetailID,
    // });
    // const [startDay, startMonth, startYear] =
    //     roomRentalDetail.startDate.split('/');
    // if (startMonth == data.month && startYear == data.year) {
    //     obj.totalPaymentAmount += roomRentalDetail.deposit
    //         ? roomRentalDetail.deposit
    //         : 0;
    // }
    // obj.totalPaymentAmount += item.payAmount;
    // obj.totalPaymentUnpaid += item.remainAmount;
    // if (item.paymentStatus) {
    //     obj.totalBillPaid++;
    // } else {
    //     obj.totalBillUnpaid++;
    // }
    // });
};
