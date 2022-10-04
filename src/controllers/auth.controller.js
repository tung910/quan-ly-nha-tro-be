const UserModel = require("~/models/user.model");
const asyncUtil = require('~/helpers/asyncUtil');
const jwt = require('jsonwebtoken');
const AppResponse = require('~/helpers/response');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    signin: asyncUtil(async (req, res) => {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email }).exec();
        if (!user) {
            console.log('tài khoản k tồn tại!');
            const msg = 'tài khoản không tồn tại!';
            AppResponse.fail(req, res)(msg);
            return;
        }

        console.log('hash pasword:', user.password);
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.log('not ok', err);
                AppResponse.fail(req, res)(msg);
                return;
            } else {
                console.log('ok', result);
                const token = jwt.sign({ _id: user._id }, "datn_tw13", { expiresIn: 60 * 60 });
                const data = {
                    token,
                    user
                }
                return AppResponse.success(req, res)(data);
            }
        })
    }),


    signup: asyncUtil(async (req, res) => {
        const { email, name, cccd, password, address, phoneNumber } = req.body;
        const existUser = await UserModel.findOne({ email }).exec();
        if (existUser) {
            const msg = 'tài khoản đã tồn tại!';
            console.log('tài khoản đã tồn tại!');
            return AppResponse.fail(req, res)(msg);
        }

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "vuonglvph15121@fpt.edu.vn",
                pass: "eivechqvbvxvpzkn",
            },
        });
        await transporter.sendMail({
            from: 'TRỌ VƯƠNG ANH',
            to: `${email}`,
            subject: "TRỌ VƯƠNG ANH XIN CHÀO THÀNH VIÊN MỚI!",
            html: `<p>Trọ Vương Anh xin cảm ơn bạn <b>${name}</b> đã lựa chọn dịch vụ của chúng tôi! 
                    Mọi thắc mắc xin liên hệ qua số điện thoại : <b>033333333</b> </p><br><b>Trân trọng!</b>`,
        }, (error) => {
            if (error) {
                return AppResponse.fail(error, res);
            }
            return res.json({
                message: `gửi mail thành công đến địa chỉ email: ${email}`
            })
        });

        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                encryptedPassword = hash;
                console.log('hash:', hash);
                const user = {
                    ...req.body, password: encryptedPassword
                }
                await UserModel(user).save();
                return AppResponse.success(req, res)(user);
            });
        })
    })
}

// đăng nhập nó sẽ 1 mã otp khoảng 6 số và set thời gian cho nó là 1 phút
// đăng nhập xong sẽ hiện ra thêm 1 cái input để nhập mã otp nếu đúng thí success