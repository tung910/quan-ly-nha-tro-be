const MotelModel = require('~/models/motel.model');
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');
const motelRoomModel = require('~/models/motel-room.model');
const calculatorMoneyModel = require('~/models/calculator-money.model');
const waterModel = require('~/models/water.model');
const dataPowerModel = require('~/models/data-power.model');

module.exports = {
    getAllMotel: asyncUtil(async (req, res) => {
        const motel = await MotelModel.find({});
        return AppResponse.success(req, res)(motel);
    }),
    createMotel: asyncUtil(async (req, res) => {
        const motel = await MotelModel(req.body).save();
        return AppResponse.success(req, res)(motel);
    }),
    editMotel: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const motel = await MotelModel.findOneAndUpdate(
            {
                _id: req.params.id,
            },
            data,
            { new: true }
        ).exec();
        return AppResponse.success(req, res)(motel);
    }),
    detailMotel: asyncUtil(async (req, res) => {
        const motel = await MotelModel.findOne({
            _id: req.params.id,
        }).exec();
        return AppResponse.success(req, res)(motel);
    }),

    deleteMotel: asyncUtil(async (req, res) => {
        const motel = await MotelModel.findOne({ _id: req.params.id }).exec();
        await MotelModel.findOneAndDelete({
            _id: req.params.id,
        }).exec();

        const motelRoom = await motelRoomModel.find({ motelID: req.params.id });
        motelRoom.map(async (item) => {
            motelRoomModel.findOneAndDelete({ _id: item._id }).exec();
        });

        const calculator = await calculatorMoneyModel
            .find({ motelID: req.params.id })
            .exec();
        calculator.map((item) => {
            calculatorMoneyModel.findOneAndDelete({ _id: item._id }).exec();
        });

        const water = await waterModel.find({ motelID: req.params.id });
        water.map((item) => {
            waterModel.findOneAndDelete({ _id: item._id }).exec();
        });

        const datapower = await dataPowerModel.find({ motelID: req.params.id });
        datapower.map((item) => {
            dataPowerModel.findOneAndDelete({ _id: item._id }).exec();
        });
        return AppResponse.success(req, res)(motel);
    }),
};
