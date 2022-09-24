const UserModel = require("~/models/user.model");
const asyncUtil = require('~/helpers/asyncUtil');
const jwt = require('jsonwebtoken');
const AppResponse = require('~/helpers/response');
const nodemailer = require('nodemailer');

module.exports = {
    signin: asyncUtil(async (req, res) => {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email }).exec();
        if (!user) {
            console.log('tài khoản k tồn tại!');
            const msg = 'tài khoản không tồn tại!';
            AppResponse.fail(req,res)(msg);
            return;
        }
        if (user.password !== password) {
            console.log('mật khẩu không chính xác!');
            const msg = 'mật khẩu không chính xác!';
            AppResponse.fail(req, res)(msg);
            return;
        }

        const token = jwt.sign({ _id: user._id }, "datn_tw13", { expiresIn: 60 * 60 });
        return AppResponse.success(req, res)('token', token)('user', user);
    }),


    signup: asyncUtil(async (req, res) => {
        const { email, name, password } = req.body;
        const existUser = await UserModel.findOne({ email }).exec();
        if (existUser) {
            console.log('tài khoản tồn tại!');
            return AppResponse.fail(req, res);
        }

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "vuonglvph15121@fpt.edu.vn",
                pass: "eivechqvbvxvpzkn",
            },
        });
        await transporter.sendMail({
            from: 'vuonglvph15121@fpt.edu.vn',
            to: `${email}`,
            subject: "TRỌ VƯƠNG ANH XIN CHÀO THÀNH VIÊN MỚI!",
            html: `<p>Trọ Vương Anh xin cảm ơn bạn ${name} đã lựa chọn dịch vụ của chúng tôi! 
                    Mọi thắc mắc xin liên hệ qua số điện thoại : <b>033333333</b> </p><br><b>Trân trọng!</b>`,
        }, (error) => {
            if (error) {
                return AppResponse.fail(error, res);
            }
            return res.json({
                message: `gửi mail thành công đến địa chỉ email: ${email}`
            })
        });

        const user = await UserModel(req.body).save();
        return AppResponse.success(req, res)(user);
    })
}

