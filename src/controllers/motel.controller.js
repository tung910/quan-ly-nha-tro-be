
const MotelModel = require('~/models/motel.model')
const asyncUtil = require('~/helpers/asyncUtil')
const AppResponse = require('~/helpers/response')

module.exports ={
    getAllMotel: asyncUtil(async (req, res) =>{
        const motel = await MotelModel.find({});
        return AppResponse.success(req, res)(motel);
    }),
    createMotel: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const motel = await MotelModel.create(data);
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
    deleteMotel: asyncUtil(async (req, res) => {
        const motel = await MotelModel.findOneAndDelete({
            _id: req.params.id,
        }).exec();
        return AppResponse.success(req, res)(motel);
    }),
    detailMotel: asyncUtil(async (req, res) => {
        const motel = await MotelModel.findOne({
            _id: req.params.id,
        }).exec();
        return AppResponse.success(req, res)(motel);
    }),
};


