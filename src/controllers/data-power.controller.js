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
        const currentMonth = (today.getMonth() + 1).toString();
        const prevMonth = today.getMonth().toString();
        // const currentDataPower = await DataPowerModel.find({
        //     month: currentMonth,
        // });
        const prevDataPower = await DataPowerModel.find({ month: prevMonth });
        await Promise.all(
            prevDataPower.map(async (item) => {
                const isExist = await DataPowerModel.findOneAndUpdate(
                    { motelRoomID: item.motelRoomID, month: currentMonth },
                    { oldValue: item.newValue }
                );
                if (isExist === null) {
                    await DataPowerModel.create({
                        customerName: item.customerName,
                        month: currentMonth,
                        year: item.year,
                        oldValue: item.newValue,
                        price:item.price,
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
