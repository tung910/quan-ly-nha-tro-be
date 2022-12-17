const asyncUtil = require('~/helpers/asyncUtil');
const OtpModel = require('~/models/otp.model');
const UserModel = require('~/models/user.model');
const { validOtp } = require('./otp.service');

module.exports = {
    verifyOtp: asyncUtil(async ({ email, otp }) => {
        const otpHolder = await OtpModel.find({ email }).lean();
        if (!otpHolder.length) {
            return { code_status: 404, message: 'Expired OTP!' };
        }
        const lastOtp = otpHolder[otpHolder.length - 1];
        const isValid = await validOtp({ otp, hashOtp: lastOtp.OTP });
        if (!isValid) {
            return { code_status: 401, message: 'Invalid OTP!' };
        }
        if (isValid && email === lastOtp.email) {
            const user = await UserModel.create({
                email: lastOtp.email,
                password: lastOtp.password,
                name: lastOtp.name,
                phone: lastOtp.phone,
            });
            if (user) {
                await OtpModel.deleteMany({ email });
            }
            return { code_status: 200, data: user };
        }
    }),
    genPassword: () => {
        const chars =
            '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const passwordLength = 12;
        let password = '';
        for (var i = 0; i <= passwordLength; i++) {
            var randomNumber = Math.floor(Math.random() * chars.length);
            password += chars.substring(randomNumber, randomNumber + 1);
        }
        return password;
    },
};
