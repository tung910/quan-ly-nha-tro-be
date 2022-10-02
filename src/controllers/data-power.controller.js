const DataPowerModel = require('~/models/data-power.model');
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
        const power = await DataPowerModel.find({})
            .populate({ path: 'motelID', select: 'name' });

        return AppResponse.success(req, res)(power);
    }),
};
