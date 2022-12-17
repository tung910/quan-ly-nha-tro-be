const WaterModel = require('~/models/water.model');
const MotelRoomModel = require('~/models/motel-room.model');
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');

module.exports = {
    createWater: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const water = await WaterModel(data).save();
        return AppResponse.success(req, res)(water);
    }),

    updateWater: asyncUtil(async (req, res) => {
        const { data } = req.body;
        let water;
        if (data.isUpdatePrice) {
            water = await WaterModel.updateMany({
                price: data.price,
            });
        } else {
            if (req.params.id) {
                water = await WaterModel.findOneAndUpdate(
                    { _id: req.params.id },
                    data,
                    { new: true }
                );
            }
        }
        return AppResponse.success(req, res)(water);
    }),
    listWater: asyncUtil(async (req, res) => {
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
        const prevDataWater = await WaterModel.find({
            month: prevMonth,
            year: prevYear,
        });
        await Promise.all(
            prevDataWater.map(async (item) => {
                const isExist = await WaterModel.findOneAndUpdate(
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
                    await WaterModel.create({
                        customerName: motelRoom.customerName,
                        month: currentMonth,
                        oldValue: item.newValue,
                        price: item.price,
                        year: currentYear,
                        roomName: item.roomName,
                        motelID: item.motelID,
                        motelRoomID: item.motelRoomID,
                    });
                }
            })
        );
        const water = await WaterModel.find(obj).populate({
            path: 'motelID',
            select: 'name',
        });
        return AppResponse.success(req, res)(water);
    }),
    getDataWaterByMotelRoom: asyncUtil(async (req, res) => {
        const { data } = req.body;
        if (data) {
            obj = data;
        }
        const dataWater = await WaterModel.findOne(obj);
        return AppResponse.success(req, res)(dataWater);
    }),
};
