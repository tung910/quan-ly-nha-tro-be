const DataPowerModel = require('~/models/data-power.model');
const MotelRoomModel = require('~/models/motel-room.model');
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');

module.exports = {
    createPower: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const power = await DataPowerModel(data).save();
        return AppResponse.success(req, res)(power);
    }),
    updatePower: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const power = await DataPowerModel.findOneAndUpdate(
            { _id: req.params.id },
            data,
            { new: true }
        );
        return AppResponse.success(req, res)(power);
    }),
    getListPower: asyncUtil(async (req, res) => {
        const { data } = req.body;
        let obj = {};
        if (data) {
            obj = data;
        }
        const today = new Date();
        var currentMonth = today.getMonth() + 1;
        var currentYear = today.getFullYear().toString();
        if (currentMonth < 10 && currentMonth > 0) {
            currentMonth = '0'.concat(currentMonth.toString());
        }
        var prevMonth = today.getMonth();
        var prevYear = today.getFullYear();
        if (prevMonth == 0) {
            prevYear = (prevYear - 1).toString();
            prevMonth = '12';
        } else {
            prevMonth = prevMonth.toString();
            prevYear = prevYear.toString();
        }
        const prevDataPower = await DataPowerModel.find({
            month: prevMonth,
            year: prevYear,
        });
        await Promise.all(
            prevDataPower.map(async (item) => {
                const isExist = await DataPowerModel.findOneAndUpdate(
                    {
                        motelRoomID: item.motelRoomID,
                        month: currentMonth,
                        year: currentYear,
                    },
                    { oldValue: item.newValue }
                );
                if (isExist === null) {
                    const motelRoom = await MotelRoomModel.findById({
                        _id: item.motelRoomID,
                    });
                    await DataPowerModel.create({
                        customerName: motelRoom.customerName,
                        month: currentMonth,
                        year: currentYear,
                        oldValue: item.newValue,
                        price: item.price,
                        roomName: item.roomName,
                        motelID: item.motelID,
                        motelRoomID: item.motelRoomID,
                    });
                }
            })
        );
        const power = await DataPowerModel.find(obj).populate({
            path: 'motelID',
            select: 'name',
        });
        return AppResponse.success(req, res)(power);
    }),
    getDataPowerByMotelRoom: asyncUtil(async (req, res) => {
        const { data } = req.body;
        if (data) {
            obj = data;
        }
        const dataWater = await DataPowerModel.findOne(obj);
        return AppResponse.success(req, res)(dataWater);
    }),
};
