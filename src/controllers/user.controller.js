const UserModel = require("~/models/user.model");
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');


module.exports = {
    signin: asyncUtil(async (req, res) => {
        const { email, password } = req.body;
        const user = await (await UserModel.findOne({ email })).save();
        if (!user) {
            return AppResponse.fail(res, req);
        }
        if (!user.authenticate(password)) {
            return AppResponse.fail(res, req);
        }
        const token = jwt.sign({ _id: user._id }, "datn_tw13", { expiresIn: 60 * 60 });
        return AppResponse.success(token, user)
    }),

    signup: asyncUtil(asyncUtil(async (req, res) => {
        const { email, name, password } = req.body;
        try {
            const existUser = await UserModel.findOne({ email }).exec();
            if (existUser) {
                return AppResponse.fail(req, res);
            }
            const user = await UserModel({ email, name, password }).save();
            return AppResponse.success(req, res)(user);
        } catch (error) {
            return AppResponse.fail(req, res);
        }
    }))
}

