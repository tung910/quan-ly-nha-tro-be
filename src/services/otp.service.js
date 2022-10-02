const bcrypt = require('bcrypt');
const asyncUtil = require('~/helpers/asyncUtil');
const OtpModel = require('~/models/otp.model');

module.exports = {
    insertOtp: asyncUtil(async ({ otp, email, password, name, phone }) => {
        const salt = await bcrypt.genSalt(10);
        const hashOtp = await bcrypt.hash(otp, salt);
        const Otp = await OtpModel({
            email,
            OTP: hashOtp,
            password,
            name,
            phone,
        }).save();
        return Otp;
    }),
    validOtp: asyncUtil(async ({ otp, hashOtp }) => {
        const isValid = await bcrypt.compare(otp, hashOtp);
        return isValid;
    }),
};
