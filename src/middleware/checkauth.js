var { expressjwt } = require('express-jwt');
const jwt = require('jsonwebtoken');
const asyncUtil = require('~/helpers/asyncUtil');
const userModel = require('~/models/user.model');

module.exports = {
    check: (req, res, next) => {
        const header = req.headers.authorization;
        if (!header)
            return res.status(403).json({
                message: 'Error',
            });
        const token = header.split(' ')[1];
        jwt.verify(token, 'datn_tw13', function (err, data) {
            if (err) return res.status(400).json('jwt expired');
            req.auth = data;
            return next();
        });
    },
    getUserById: asyncUtil(async (req, res, next) => {
        const user = await userModel.findById({ _id: req.headers.userid });
        req.profile = user;
        req.profile.password = undefined;
        next();
    }),
    isAuth: (req, res, next) => {
        const user = req.profile._id == req.auth._id;
        if (!user) {
            return res.status(402).json({
                message: 'Bạn không được phép truy cập',
            });
        }
        next();
    },
    isAdmin: (req, res, next) => {
        if (req.profile.role == 0) {
            return res.status(401).json({
                message: 'Ban khong phai la admin',
            });
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
