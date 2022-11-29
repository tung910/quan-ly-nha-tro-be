const nodemailer = require('nodemailer');
const CustomerModel = require('~/models/customer.model');
const UserModel = require('~/models/user.model');
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');
const bcrypt = require('bcrypt');

module.exports = {
    getAllCustomer: asyncUtil(async (req, res) => {
        const customer = await CustomerModel.find({});
        return AppResponse.success(req, res)(customer);
    }),
    addCustomer: asyncUtil(async (req, res) => {
        const customer = await CustomerModel(req.body).save();
        return AppResponse.success(req, res)(customer);
    }),
    editCustomer: asyncUtil(async (req, res) => {
        const customer = await CustomerModel.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        ).exec();
        return AppResponse.success(req, res)(customer);
    }),
    deleteCustomer: asyncUtil(async (req, res) => {
        const customer = await CustomerModel.findOneAndDelete({
            _id: req.params.id,
        }).exec();
        return AppResponse.success(req, res)(customer);
    }),
    detailCustomer: asyncUtil(async (req, res) => {
        const customer = await CustomerModel.findOne({
            _id: req.params.id,
        }).exec();
        return AppResponse.success(req, res)(customer);
    }),
    sendEmail: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const emailList = data.email;
        const emailLength = emailList.length;
        for (let index = 0; index < emailLength; index++) {
            const email = emailList[index];
            handleSendEmail(email);
        }
        return AppResponse.success(req, res)(null, 'Gửi email thành công!');
    }),
};

const handleSendEmail = async (email) => {
    const user = await UserModel.findOne({ email });
    if (!user) return;
    const password = process.env.PASSWORD_CUSTOMER || user.password;

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
            html: `<p>Trọ Vương Anh xin cảm ơn bạn đã lựa chọn dịch vụ của chúng tôi! <br />
                Email của bạn là:<b> ${user.email}</b> <br />  
                Mật khẩu của bạn là: <b>${password}</b> <br />  
                <i>Vui lòng không chia sẻ mã này cho bất kì ai </i>
                <br />  Mọi thắc mắc xin liên hệ qua số điện thoại : <b  style="color:red">0362982605</b> </p><br><b>Trân trọng!</b>`,
        },
        (error) => {
            if (error) return AppResponse.fail(error);
        }
    );
};
