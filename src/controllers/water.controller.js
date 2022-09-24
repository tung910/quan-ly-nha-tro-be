const WaterModel = require('~/models/water.model');
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');

module.exports = {
    createWater: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const water = await WaterModel.create(data);
        return AppResponse.success(req, res)(water);
    }),
    updateWater: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const water = await WaterModel.create(data);
        return AppResponse.success(req, res)(water);
    }),
    listWater: asyncUtil(async (req, res) => {
        const water = await WaterModel.find({})
            .populate({ path: 'customerId', select: 'name' })
            .populate({ path: 'motelRoomId', select: 'roomName'})
            .populate({ path: 'motelId', select: 'name' });

        return AppResponse.success(req, res)(water);
    }),
};