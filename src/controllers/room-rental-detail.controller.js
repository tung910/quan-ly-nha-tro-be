const RoomRentalDetail = require('~/models/room-rental-detail.model');
const asyncUtil = require('~/helpers/asyncUtil');
const AppResponse = require('~/helpers/response');
const MotelRoomModel = require('~/models/motel-room.model');
const DataWaterModel = require('~/models/water.model');
const DataPowerModel = require('~/models/data-power.model');
const UserModel = require('~/models/user.model');
const bcrypt = require('bcrypt');

module.exports = {
    createRoomRentalDetail: asyncUtil(async (req, res) => {
        const {
            data: { CustomerInfo, Member, Service, Contract },
        } = req.body;

        const { email, phone, citizenIdentification } = CustomerInfo;
        const existsEmail = await UserModel.findOne({ email: email }).exec();
        const existsPhone = await UserModel.findOne({ phone: phone }).exec();
        const existsCitizenIdentification = await UserModel.findOne({ citizenIdentificationNumber: citizenIdentification }).exec();
        const arrMsg = [];
        if (existsEmail) {
            const msgEmail = "Email đã tồn tại!"
            arrMsg.push({ msgEmail });
        }
       
        if (arrMsg.length > 0) return AppResponse.fail(req, res)(arrMsg);

        const roomRentalDetail = await RoomRentalDetail({
            ...CustomerInfo,
            service: Service,
            member: Member,
        }).save();
        const password = await bcrypt.hash(process.env.PASSWORD_CUSTOMER, 10);
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
        await UserModel.create(account);
        const [day, month, year] = CustomerInfo.startDate.split('/');
        await DataPowerModel.findOneAndUpdate(
            { roomName: CustomerInfo.roomName },
            {
                customerName: CustomerInfo.customerName,
                month: month,
                year: year,
            }
        ).exec();
        await DataWaterModel.findOneAndUpdate(
            { roomName: CustomerInfo.roomName },
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
        const roomRentalDetail = await RoomRentalDetail.find({});
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
        if (CustomerInfo == '' || CustomerInfo == null) {
            console.log('yêu cầu nhập đủ thông tin!');
            const msg = 'yêu cầu nhập đủ thông tin!';
            return AppResponse.fail(req, res)(msg);
        }
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
            { roomName: CustomerInfo.roomName },
            {
                customerName: CustomerInfo.customerName,
                month: month,
                year: year,
            }
        ).exec();
        await DataWaterModel.findOneAndUpdate(
            { roomName: CustomerInfo.roomName },
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
            payEachTime
        } = roomRentalDetail;
        await RoomRentalDetail.findByIdAndDelete({ _id: req.params.id }).exec();
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
            _id: motelRoomID
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
                new: true
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
};
