const UserModel = require('~/models/user.model');
const asyncUtil = require('~/helpers/asyncUtil');
const jwt = require('jsonwebtoken');
const AppResponse = require('~/helpers/response');
const nodemailer = require('nodemailer');
const passport = require('passport');
const passportConfig = require('../config/passport');

module.exports = {
    signin: asyncUtil(async (req, res) => {
        const { email, name, phoneNumber } = req.body;
        const user = await UserModel.findOne({ email }).exec();
        if (!user) {
            return AppResponse.fail(req, res);
        }

        // if (!user.authenticate(password)) {
        //     return AppResponse.fail(res, req);
        // }
        // if (!user.password) {
        //     return AppResponse.fail(req, res);
        // }
        // const token = jwt.sign({ _id: user._id }, "datn_tw13", { expiresIn: 60 * 60 });
        // return AppResponse.success(req, res)(token, user)

        passport.authenticate('local', { session: false }),
            (req, res) => {
                if (req.authenticated()) {
                    const { _id, name, phoneNumber } = req.user;
                    const token = signToken(_id);
                    res.cookie('access_token', token, {
                        httpOnly: true,
                        sameSite: true,
                    });
                    res.status(200).json({
                        isAuthenticated: true,
                        user: { _id, name, phoneNumber },
                    });
                }
            };
    }),

    signup: asyncUtil(async (req, res) => {
        const { email, name, password } = req.body;
        try {
            const existUser = await UserModel.findOne({ email }).exec();
            if (existUser) {
                return AppResponse.fail(req, res);
            }
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'vuonglvph15121@fpt.edu.vn',
                    pass: 'eivechqvbvxvpzkn',
                },
            });
            await transporter.sendMail(
                {
                    from: 'vuonglvph15121@fpt.edu.vn',
                    to: `${email}`,
                    subject: 'TRỌ VƯƠNG ANH XIN CHÀO THÀNH VIÊN MỚI!',
                    html: `<p>Trọ Vương Anh xin cảm ơn bạn ${name} đã lựa chọn dịch vụ của chúng tôi! 
                    Mọi thắc mắc xin liên hệ qua số điện thoại : <b>033333333</b> </p><br><b>Trân trọng!</b>`,
                },
                (error) => {
                    if (error) {
                        return AppResponse.fail(error, res);
                    }
                    return res.json({
                        message: `gửi mail thành công đến địa chỉ email: ${email}`,
                    });
                }
            );
            const user = await UserModel(req.body).save();
            return AppResponse.success(req, res)(user);
        } catch (error) {
            return AppResponse.fail(req, res);
        }
    }),
};
