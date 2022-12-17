var { expressjwt } = require('express-jwt');
const jwt = require('jsonwebtoken');
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');
const userModel = require('~/models/user.model');

module.exports = {
    check: (req, res, next) => {
        const header = req.headers.authorization;
        if (!header)
            return AppResponse.fail(req, res, 401)(null, 'Unauthorzied');
        const token = header.split(' ')[1];
        jwt.verify(token, 'datn_tw13', function (err, data) {
            if (err)
                return AppResponse.fail(
                    req,
                    res,
                    401
                )(null, 'Phiên đăng nhập đã quá hạn');
            req.auth = data;
            return next();
        });
    },
    getUserById: asyncUtil(async (req, res, next) => {
        if (!req.headers.authid)
            return AppResponse.fail(req, res, 401)(null, 'Unauthorzied');
        const user = await userModel.findById({ _id: req.headers.authid });
        req.profile = user;
        req.profile.password = undefined;
        next();
    }),
    isAuth: (req, res, next) => {
        const user = req.profile._id == req.auth._id;
        if (!user) {
            return AppResponse.fail(
                req,
                res,
                403
            )(null, 'Bạn không được phép truy cập');
        }
        next();
    },
    isAdmin: (req, res, next) => {
        if (req.profile.role == 0) {
            return AppResponse.fail(
                req,
                res,
                403
            )(null, 'Bạn không được phép truy cập');
        }
        next();
    },
    checkAuth: (req, res, next) => {
        const isAdmin = true;
        if (isAdmin) {
            next();
        } else {
            res.redirect('/');
        }
    },
};
