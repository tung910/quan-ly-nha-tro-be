const nodemailer = require('nodemailer');
const RoomRentalDetail = require('~/models/room-rental-detail.model');
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');
const MotelRoomModel = require('~/models/motel-room.model');
const DataWaterModel = require('~/models/water.model');
const DataPowerModel = require('~/models/data-power.model');
const UserModel = require('~/models/user.model');
const bcrypt = require('bcrypt');
const { genPassword } = require('~/services/user.service');

module.exports = {
    createRoomRentalDetail: asyncUtil(async (req, res) => {
        const {
            data: { CustomerInfo, Member, Service, Contract },
        } = req.body;

        const { email, phone, citizenIdentification } = CustomerInfo;
        const existsEmail = await UserModel.findOne({ email: email }).exec();
        const existsPhone = await UserModel.findOne({ phone: phone }).exec();
        const existsCitizenIdentification = await UserModel.findOne({
            citizenIdentificationNumber: citizenIdentification,
        }).exec();
        if (existsEmail) {
            return AppResponse.fail(req, res, 400)(null, 'Email đã tồn tại');
        }
        const validateEmail = (email) => {
            return String(email)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
        };
        if (!validateEmail(email)) {
            return AppResponse.fail(req, res, 400)(null, 'Yêu cầu nhập đúng định dạng email!');
        }
        if (existsPhone) {
            return AppResponse.fail(
                req,
                res,
                400
            )(null, 'Số điện thoại đã tồn tại');
        }
        const regexPhone = /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/;
        if (!phone.match(regexPhone)) {
            return AppResponse.fail(req, res, 400)(null, 'Yêu cầu nhập đúng định dạng số điện thoại!');
        }
        if (existsCitizenIdentification) {
            return AppResponse.fail(req, res, 400)(null, 'Số CCCD đã tồn tại');
        }
        const PASSWORD_CUSTOMER = genPassword();
        console.log(PASSWORD_CUSTOMER);
        const password = await bcrypt.hash(PASSWORD_CUSTOMER, 10);
        const account = {
            email: CustomerInfo.email,
            password: password,
            role: 0,
            motelRoomID: CustomerInfo.motelRoomID,
            phone: CustomerInfo.phone,
            name: CustomerInfo.customerName,
            citizenIdentificationNumber: CustomerInfo.citizenIdentification,
            address: CustomerInfo.address,
        };
        const newAccount = await UserModel.create(account);

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
                html: `<h2>Trọ Vương Anh xin cảm ơn bạn đã lựa chọn dịch vụ của chúng tôi!<h2 />  
                <p>Email của bạn là:<b> ${CustomerInfo.email}</b></p>
               <p> Mật khẩu của bạn là: <b>${PASSWORD_CUSTOMER}</b></p>  
                <i>Vui lòng không chia sẻ mã này cho bất kì ai </i>   
                <h4>Đăng nhập ngay <a href='${process.env.URL_LOGIN}'>tại đây</a>!</h4>
                <br /> 
                 <br />  Mọi thắc mắc xin liên hệ qua số điện thoại : <b  style="color:red">0362982605</b> </h2><br><b>Trân trọng!</b>`,
            },
            (error) => {
                if (error) return AppResponse.fail(error);
            }
        );
        const roomRentalDetail = await RoomRentalDetail({
            ...CustomerInfo,
            service: Service,
            userID: newAccount._id,
            member: Member,
            contract: Contract,
        }).save();
        const [day, month, year] = CustomerInfo.startDate.split('/');
        await DataPowerModel.findOneAndUpdate(
            {
                roomName: CustomerInfo.roomName,
                motelID: CustomerInfo.motelID,
            },
            {
                customerName: CustomerInfo.customerName,
                month: month,
                year: year,
            }
        ).exec();
        await DataWaterModel.findOneAndUpdate(
            {
                roomName: CustomerInfo.roomName,
                motelID: CustomerInfo.motelID,
            },
            {
                customerName: CustomerInfo.customerName,
                month: month,
                year: year,
            }
        ).exec();
        await MotelRoomModel.findByIdAndUpdate(
            { _id: CustomerInfo.motelRoomID },
            {
                isRent: true,
                customerName: CustomerInfo.customerName,
                roomRentID: roomRentalDetail._id,
                avatarCustomer: CustomerInfo.image,
            }
        ).exec();
        await DataWaterModel.findOneAndUpdate(
            {
                roomName: CustomerInfo.roomName,
                motelID: CustomerInfo.motelID,
            },
            { motelRoomID: CustomerInfo.motelRoomID }
        );
        await DataPowerModel.findOneAndUpdate(
            {
                roomName: CustomerInfo.roomName,
                motelID: CustomerInfo.motelID,
            },
            { motelRoomID: CustomerInfo.motelRoomID }
        );
        return AppResponse.success(req, res)(roomRentalDetail);
    }),
    getAllRoomRentalDetail: asyncUtil(async (req, res) => {
        const roomRentalDetail = await RoomRentalDetail.find({}).lean();
        return AppResponse.success(req, res)(roomRentalDetail);
    }),
    deleteRoomRentalDetail: asyncUtil(async (req, res) => {
        const roomRentalDetail = await RoomRentalDetail.findOneAndDelete({
            _id: req.params.id,
        }).exec();
        return AppResponse.success(req, res)(roomRentalDetail);
    }),
    getRoomRentalDetail: asyncUtil(async (req, res) => {
        const roomRentalDetail = await RoomRentalDetail.findOne({
            _id: req.params.id,
        }).exec();
        return AppResponse.success(req, res)(roomRentalDetail);
    }),
    editRoomRentalDetail: asyncUtil(async (req, res) => {
        const {
            data: { CustomerInfo, Member, Service, Contract },
        } = req.body;
        const { email, phone, citizenIdentification, customerName } =
            CustomerInfo;
        const existsEmail = await UserModel.findOne({ email: email }).exec();
        const existsPhone = await UserModel.findOne({ phone: phone }).exec();
        const existsCitizenIdentification = await UserModel.findOne({
            citizenIdentificationNumber: citizenIdentification,
        }).exec();
        const { email: prevEmail } = await RoomRentalDetail.findById({
            _id: req.params.id,
        });
        const { phone: prevPhone } = await RoomRentalDetail.findById({
            _id: req.params.id,
        });
        const { citizenIdentification: prevCitizenIdentificationNumber } =
            await RoomRentalDetail.findById({
                _id: req.params.id,
            });
        if (existsEmail && existsEmail.email !== prevEmail) {
            return AppResponse.fail(req, res, 400)(null, 'Email đã tồn tại');
        }
        if (existsPhone && existsPhone.phone !== prevPhone) {
            return AppResponse.fail(
                req,
                res,
                400
            )(null, 'Số điện thoại đã tồn tại');
        }
        if (
            existsCitizenIdentification &&
            existsCitizenIdentification.citizenIdentificationNumber !==
            prevCitizenIdentificationNumber
        ) {
            return AppResponse.fail(req, res, 400)(null, 'Số CCCD đã tồn tại');
        }
        const account = {
            email: CustomerInfo.email,
            motelRoomID: CustomerInfo.motelRoomID,
            phone: CustomerInfo.phone,
            name: CustomerInfo.customerName,
            citizenIdentificationNumber: CustomerInfo.citizenIdentification,
            address: CustomerInfo.address,
        };

        await UserModel.findOneAndUpdate({ email: prevEmail }, account, {
            new: true,
        });
        const roomRentalDetail = await RoomRentalDetail.findOneAndUpdate(
            {
                _id: req.params.id,
            },
            {
                ...CustomerInfo,
                service: Service,
                member: Member,
            },
            { new: true }
        ).exec();
        const [day, month, year] = CustomerInfo.startDate.split('/');
        await DataPowerModel.findOneAndUpdate(
            { motelRoomID: CustomerInfo.motelRoomID },
            {
                customerName: CustomerInfo.customerName,
                month: month,
                year: year,
            }
        ).exec();
        await DataWaterModel.findOneAndUpdate(
            { motelRoomID: CustomerInfo.motelRoomID },
            {
                customerName: CustomerInfo.customerName,
                month: month,
                year: year,
            }
        ).exec();
        await MotelRoomModel.findByIdAndUpdate(
            { _id: CustomerInfo.motelRoomID },
            {
                isRent: true,
                customerName: CustomerInfo.customerName,
                roomRentID: roomRentalDetail._id,
            }
        ).exec();
        return AppResponse.success(req, res)(roomRentalDetail);
    }),

    changeRoomRentalDetail: asyncUtil(async (req, res) => {
        const { DateChangeRoom, NewRoomID } = req.body;
        const roomRentalDetail = await RoomRentalDetail.findOne({
            _id: req.params.id,
        });
        const {
            motelRoomID,
            roomName,
            customerName,
            email,
            citizenIdentification,
            address,
            dateRange,
            issuedBy,
            phone,
            member,
            service,
            payEachTime,
        } = roomRentalDetail;
        await RoomRentalDetail.findByIdAndDelete({ _id: req.params.id }).exec();
        const xyz = await RoomRentalDetail.findByIdAndDelete({
            _id: req.params.id,
        }).exec();
        const motelOld = await MotelRoomModel.findOne({ _id: motelRoomID });
        const avatarCustomer = motelOld.avatarCustomer;
        const motelRoomNew = await MotelRoomModel.findOne({ _id: NewRoomID });
        const nameMotelRoom = motelRoomNew.roomName;
        const idMotel = motelRoomNew.motelID;
        const unitPrice = motelRoomNew.unitPrice;
        const custumerInfor = {
            motelRoomID: NewRoomID,
            email,
            startDate: DateChangeRoom,
            priceRoom: unitPrice,
            customerName,
            roomName: nameMotelRoom,
            citizenIdentification,
            address,
            dateRange,
            phone,
            payEachTime,
        };
        const motelRoomOld = await MotelRoomModel.findById({
            _id: motelRoomID,
        });
        const roomNameOld = motelRoomOld.roomName;
        const maxPersonOld = motelRoomOld.maxPerson;
        const imagesOld = motelRoomOld.images;
        const widthOld = motelRoomOld.width;
        const heightOld = motelRoomOld.height;
        const unitPriceOld = motelRoomOld.unitPrice;
        const leaseOld = motelRoomOld.lease;
        const isDebitOld = motelRoomOld.isDebit;
        const dataOld = {
            roomName: roomNameOld,
            customerName: '',
            maxPerson: maxPersonOld,
            images: imagesOld,
            width: widthOld,
            height: heightOld,
            unitPrice: unitPriceOld,
            lease: leaseOld,
            isDebit: isDebitOld,
            isRent: false,
            avatarCustomer:
                'https://res.cloudinary.com/dhfndew6y/image/upload/v1666108397/upload-by-nodejs/kbd0oqh53vnet31epfdf.png',
        };
        dataOld.roomRentID = undefined;
        await MotelRoomModel.findByIdAndUpdate({ _id: motelRoomID }, dataOld, {
            new: true,
        }).exec();
        const roomRentalDetailNew = await RoomRentalDetail({
            ...custumerInfor,
            service,
            member,
        }).save();
        await MotelRoomModel.findByIdAndUpdate(
            { _id: NewRoomID },
            {
                isRent: true,
                customerName: custumerInfor.customerName,
                roomRentID: roomRentalDetailNew._id,
                avatarCustomer: avatarCustomer,
            },
            {
                new: true,
            }
        ).exec();
        const [day, month, year] = custumerInfor.startDate.split('/');
        await DataPowerModel.findOneAndUpdate(
            { roomName: roomNameOld },
            {
                customerName: '',
                month: month,
                year: year,
            }
        ).exec();
        await DataWaterModel.findOneAndUpdate(
            { roomName: roomNameOld },
            {
                customerName: '',
                month: month,
                year: year,
            }
        ).exec();
        await DataWaterModel.findOneAndUpdate(
            {
                roomName: nameMotelRoom,
                motelID: idMotel,
            },
            {
                customerName: custumerInfor.customerName,
                motelRoomID: NewRoomID,
                month: month,
                year: year,
            }
        );
        await DataPowerModel.findOneAndUpdate(
            {
                roomName: nameMotelRoom,
                motelID: idMotel,
            },
            {
                customerName: custumerInfor.customerName,
                motelRoomID: NewRoomID,
                month: month,
                year: year,
            }
        );
        return AppResponse.success(req, res)(roomRentalDetailNew);
    }),
    getRoomRentalDetailByEmail: asyncUtil(async (req, res) => {
        const { data } = req.body;
        const roomRentalDetail = await RoomRentalDetail.findOne({
            email: data.email,
        }).exec();
        return AppResponse.success(req, res)(roomRentalDetail);
    }),
    changeRoom: async (data) => {
        const {
            DateChangeRoom,
            NewRoomID,
            roomRentalDetail: roomRentalDetailId,
        } = data;
        const roomRentalDetail = await RoomRentalDetail.findOne({
            _id: roomRentalDetailId,
        });
        const {
            motelRoomID,
            roomName,
            customerName,
            email,
            citizenIdentification,
            address,
            dateRange,
            issuedBy,
            phone,
            member,
            service,
            payEachTime,
        } = roomRentalDetail;
        const xyz = await RoomRentalDetail.findByIdAndDelete({
            _id: roomRentalDetailId,
        }).exec();
        const motelOld = await MotelRoomModel.findOne({ _id: motelRoomID });
        const avatarCustomer = motelOld.avatarCustomer;
        const motelRoomNew = await MotelRoomModel.findOne({ _id: NewRoomID });
        const nameMotelRoom = motelRoomNew.roomName;
        const idMotel = motelRoomNew.motelID;
        const unitPrice = motelRoomNew.unitPrice;
        const custumerInfor = {
            motelRoomID: NewRoomID,
            email,
            startDate: DateChangeRoom,
            priceRoom: unitPrice,
            customerName,
            roomName: nameMotelRoom,
            citizenIdentification,
            address,
            dateRange,
            phone,
            payEachTime,
        };
        const motelRoomOld = await MotelRoomModel.findById({
            _id: motelRoomID,
        });
        const roomNameOld = motelRoomOld.roomName;
        const maxPersonOld = motelRoomOld.maxPerson;
        const imagesOld = motelRoomOld.images;
        const widthOld = motelRoomOld.width;
        const heightOld = motelRoomOld.height;
        const unitPriceOld = motelRoomOld.unitPrice;
        const leaseOld = motelRoomOld.lease;
        const isDebitOld = motelRoomOld.isDebit;
        const dataOld = {
            roomName: roomNameOld,
            customerName: '',
            maxPerson: maxPersonOld,
            images: imagesOld,
            width: widthOld,
            height: heightOld,
            unitPrice: unitPriceOld,
            lease: leaseOld,
            isDebit: isDebitOld,
            isRent: false,
            avatarCustomer:
                'https://res.cloudinary.com/dhfndew6y/image/upload/v1666108397/upload-by-nodejs/kbd0oqh53vnet31epfdf.png',
        };
        dataOld.roomRentID = undefined;
        await MotelRoomModel.findByIdAndUpdate({ _id: motelRoomID }, dataOld, {
            new: true,
        }).exec();
        const roomRentalDetailNew = await RoomRentalDetail({
            ...custumerInfor,
            service,
            member,
        }).save();
        await MotelRoomModel.findByIdAndUpdate(
            { _id: NewRoomID },
            {
                isRent: true,
                customerName: custumerInfor.customerName,
                roomRentID: roomRentalDetailNew._id,
                avatarCustomer: avatarCustomer,
            },
            {
                new: true,
            }
        ).exec();
        const [day, month, year] = custumerInfor.startDate.split('/');
        await DataPowerModel.findOneAndUpdate(
            { roomName: roomNameOld },
            {
                customerName: '',
                month: month,
                year: year,
            }
        ).exec();
        await DataWaterModel.findOneAndUpdate(
            { roomName: roomNameOld },
            {
                customerName: '',
                month: month,
                year: year,
            }
        ).exec();
        await DataWaterModel.findOneAndUpdate(
            {
                roomName: nameMotelRoom,
                motelID: idMotel,
            },
            {
                customerName: custumerInfor.customerName,
                motelRoomID: NewRoomID,
                month: month,
                year: year,
            }
        );
        await DataPowerModel.findOneAndUpdate(
            {
                roomName: nameMotelRoom,
                motelID: idMotel,
            },
            {
                customerName: custumerInfor.customerName,
                motelRoomID: NewRoomID,
                month: month,
                year: year,
            }
        );
        return roomRentalDetailNew;
    },
};
