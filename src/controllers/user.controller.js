const UserModel = require('~/models/user.model');
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');

module.exports = {
    getAllUsers: asyncUtil(async (req, res) => {
        const users = await UserModel.find({});
        return AppResponse.success(req, res)(users);
    })
};
