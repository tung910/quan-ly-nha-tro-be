const MotelModel = require('~/models/motel.model');
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');
const motelRoomModel = require('~/models/motel-room.model');
const roomRentalDetailModel = require('~/models/room-rental-detail.model');
const calculatorMoneyModel = require('~/models/calculator-money.model');

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
        const data = await MotelModel.findOneAndDelete({
            _id: req.params.id,
        }).exec();

        await motelRoomModel.findOneAndDelete({
            motelID: req.params.id
        }).exec();

        await calculatorMoneyModel.findOneAndDelete({ motelID: req.params.id }).exec();

        const motel = await MotelModel.find({});
        await roomRentalDetailModel.findOneAndDelete({
            roomName: motel[0].name
        })

        await roomRentalDetailModel.findOneAndDelete({ motelID: req.params.id }).exec();

        //thiếu xóa điện nc
        return AppResponse.success(req, res)(data);
    })
};
