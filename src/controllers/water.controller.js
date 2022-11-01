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
        const water = await WaterModel.findOneAndUpdate(
            { _id: req.params.id },
            data,
            { new: true }
        );
        return AppResponse.success(req, res)(water);
    }),
    listWater: asyncUtil(async (req, res) => {
        const { data } = req.body;
        let obj = {};
        if (data) {
            obj = data;
        }
        const today = new Date();
        const currentMonth = (today.getMonth() + 1).toString();
         const prevMonth = today.getMonth().toString();
         const currentDataWater = await WaterModel.find({
             month: currentMonth,
         });
         const prevDataWater = await WaterModel.find({ month: prevMonth });
        if (currentDataWater.length === 0) {
            await Promise.all(
                prevDataWater.map(async (item) => {
                    await WaterModel.create({
                        customerName: item.customerName,
                        month: currentMonth,
                        oldValue:item.newValue,
                        year: item.year,
                        roomName: item.roomName,
                        motelID: item.motelID,
                        motelRoomID: item._id,
                    });
                })
            );
            const water = await WaterModel.find(obj).populate({
                path: 'motelID',
                select: 'name',
            });
            return AppResponse.success(req, res)(water);
        } else {
            const water = await WaterModel.find(obj).populate({
                path: 'motelID',
                select: 'name',
            });

            return AppResponse.success(req, res)(water);
        }
    }),
    getDataWaterByMotelRoom: asyncUtil(async (req, res) => {
      const {data} = req.body
      if (data) {
          obj = data;
      }
        const dataWater = await WaterModel.findOne(obj);
        return AppResponse.success(req, res)(dataWater);
    }),
};
