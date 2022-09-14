const MotelRoomModel = require('~/models/motel-room.model');
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');

module.exports = {
    getAllMotelRoom: asyncUtil(async (req, res) => {
        const motelRoom = await MotelRoomModel.find({});
        return AppResponse.success(req, res)(motelRoom);
    }),
};