const asyncUtil = require('~/helpers/asyncUtil');
const OtpModel = require('~/models/otp.model');
const UserModel = require('~/models/user.model');
const { validOtp } = require('./otp.service');

module.exports = {
    verifyOtp: asyncUtil(async ({ email, otp }) => {
        const otpHolder = await OtpModel.find({ email });
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
};
