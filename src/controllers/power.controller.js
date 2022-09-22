const PowerModel = require('~/models/power.model');
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');

module.exports = {
    createPower: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const power = await PowerModel.create(data);
        return AppResponse.success(req, res)(power);
    })
};