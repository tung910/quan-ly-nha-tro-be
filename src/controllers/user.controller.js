const UserModel = require('~/models/user.model');
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');

module.exports = {
    getAllUsers: asyncUtil(async (req, res) => {
        const users = await UserModel.find({});
        return AppResponse.success(req, res)(users);
    }),
    getUserById: asyncUtil(async (req, res,next,id) => {
        const user = await UserModel.findById(id);
        req.profile = user;
        req.profile.password = undefined;
        next();
    }),
};
