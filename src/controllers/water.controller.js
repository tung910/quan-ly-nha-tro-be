const WaterModel = require('~/models/water.model');
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
        const water = await WaterModel.find({}).populate({
            path: 'motelID',
            select: 'name',
        });
        return AppResponse.success(req, res)(water);
    }),
    getDataWaterByMotelRoom: asyncUtil(async (req, res) => {
        const dataWater = await WaterModel.find({
            motelRoomID: req.params.motelRoomId,
        });
        return AppResponse.success(req, res)(dataWater);
    }),
};
