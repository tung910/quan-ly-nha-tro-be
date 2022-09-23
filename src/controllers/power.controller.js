const PowerModel = require('~/models/power.model');
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');

module.exports = {
    createPower: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const power = await PowerModel(data).save();
        return AppResponse.success(req, res)(power);
    }),
    updatePower: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const power = await PowerModel.findOneAndUpdate(
            { _id: req.params.id },
            data,
            { new: true }
        );
        return AppResponse.success(req, res)(power);
    }),
    getListPower: asyncUtil(async (req, res) => {
        const power = await PowerModel.find({})
            .populate({ path: 'customerId', select: 'name' })
            .populate({ path: 'motelRoomId', select: 'roomName' })
            .populate({ path: 'motelId', select: 'name' });

        return AppResponse.success(req, res)(power);
    }),
};
