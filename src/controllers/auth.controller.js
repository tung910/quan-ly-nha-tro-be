const OtpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const UserModel = require('~/models/user.model');
const AppResponse = require('~/helpers/response');
const asyncUtil = require('~/helpers/asyncUtil');
const { insertOtp } = require('~/services/otp.service');
const { verifyOtp } = require('~/services/user.service');

module.exports = {
    signin: asyncUtil(async (req, res) => {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email }).exec();
        if (!user) {
            return AppResponse.fail(req, res)(null, 'Tài khoản không tồn tại');
        }
        const isLogin = await user.authenticate(password);
        if (!isLogin) {
            return AppResponse.fail(req, res)(null, 'Password is not correct');
        }

        const token = jwt.sign({ _id: user._id }, 'datn_tw13', {
            expiresIn: 60 * 60,
        });
        const options = {
            maxAge: 24 * 60 * 60, // Expires after 1 day
            secure: true,
            httpOnly: true,
            sameSite: 'none',
        };
        res.cookie('token', token, options);
        return AppResponse.success(req, res)({ token, user });
    }),
    logout: asyncUtil(async (req, res) => {
        res.clearCookie('token');
        return AppResponse.success(req, res)('', 'Log out successfully');
    }),
    signup: asyncUtil(async (req, res) => {
        const { email, password, name, phone } = req.body;
        const existUser = await UserModel.findOne({ email }).exec();
        if (existUser) {
            return AppResponse.fail(req, res)('', 'Email already exists');
        }
        const OTP = OtpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            specialChars: false,
            upperCaseAlphabets: false,
        });
        await insertOtp({ otp: OTP, email, password, name, phone });

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_APP,
                pass: process.env.PASS_APP,
            },
        });
        await transporter.sendMail(
            {
                from: process.env.EMAIL_APP,
                to: `${email}`,
                subject: 'TRỌ VƯƠNG ANH XIN CHÀO!',
                html: `<p>Trọ Vương Anh xin cảm ơn bạn ${name} đã lựa chọn dịch vụ của chúng tôi! <br />
                Mã OTP của bạn là: ${OTP}
                  <br />  Mọi thắc mắc xin liên hệ qua số điện thoại : <b>033333333</b> </p><br><b>Trân trọng!</b>`,
            },
            (error) => {
                if (error) return AppResponse.fail(error, res);
            }
        );
        return AppResponse.success(req, res)(
            '',
            `Vui lòng kiểm tra email của bạn: ${email}`
        );
    }),
    verifyOtp: asyncUtil(async (req, res) => {
        const { email, otp } = req.body;
        const user = await verifyOtp({ email, otp });
        if (user.code_status === 200) {
            return AppResponse.success(req, res)(user.data);
        }
        return AppResponse.fail(req, res)(null, user.message);
    }),
};
