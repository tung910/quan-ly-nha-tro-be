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
        const roomRentalDetail = await RoomRentalDetail({
            ...CustomerInfo,
            service: Service,
            member: Member,
        }).save();
        const password = await bcrypt.hash('123456789', 10);
        const account = {
            email: CustomerInfo.email,
            password: password,
            role: 0,
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
        // lấy id roomren cũ/ get customer ở roomrent cũ /rồi xóa roomrent
        // lấy custumer cũ gán vào roomrent mới 
        // xóa roomrent cũ
        // xóa id roomrent trong motel room

        // thêm mới room rent thiey email startdate price room

        const { DateChangeRoom, NewRoomID } = req.body;
        const roomRentalDetail = await RoomRentalDetail.findOne({ _id: req.params.id });

        //lấy id phòng để update id phòng ok
        const { motelRoomID, customerName, email, userID, citizenIdentification, address, dateRange, phone, member, service, payEachTime } = roomRentalDetail;

        // lấy tên phòng mới ok
        const motelOld = await MotelRoomModel.findOne({ _id: motelRoomID });
        const unitPrice = motelOld.unitPrice;
        const avatarCustomer = motelOld.avatarCustomer;

        const motelRoomNew = await MotelRoomModel.findOne({ _id: NewRoomID });
        const nameMotelRoom = motelRoomNew.roomName;
        //lấy custumerInfor lấy dữ liệu mới 
        const custumerInfor = {
            motelRoomID: NewRoomID,
            email,
            startDate: DateChangeRoom,
            priceRoom: unitPrice,
            customerName,
            roomName: nameMotelRoom,
            userID,
            citizenIdentification,
            address,
            dateRange,
            phone,
            payEachTime
        }

        //xóa id room rent trong motelroom cũ (xóa id roomren và xóa custumer name)
        const motelRoomOld = await MotelRoomModel.findById({ _id: motelRoomID });
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
            customerName: "",
            maxPerson: maxPersonOld,
            images: imagesOld,
            width: widthOld,
            height: heightOld,
            unitPrice: unitPriceOld,
            lease: leaseOld,
            isDebit: isDebitOld,
            isRent: false,
            avatarCustomer: undefined
        }
        dataOld.roomRentID = undefined;
        //update phòng cũ
        await MotelRoomModel.findByIdAndUpdate(
            { _id: motelRoomID },
            dataOld,
            { new: true }
        ).exec();

        //Thêm vào phòng mới   
        const roomRentalDetailNew = await RoomRentalDetail({
            ...custumerInfor,
            service,
            member,
        }).save();

        //xóa chi tiết thêm phòng ok
        await RoomRentalDetail.findByIdAndDelete({ _id: req.params.id }).exec();

        // thêm id room rent vào phòng mới
        await MotelRoomModel.findByIdAndUpdate(
            { _id: NewRoomID },
            {
                isRent: true,
                customerName: custumerInfor.customerName,
                roomRentID: roomRentalDetailNew._id,
                avatarCustomer: avatarCustomer,
            }, {
            new: true
        }
        ).exec();

        // const [day, month, year] = custumerInfor.startDate.split('/');
        // await DataPowerModel.findOneAndUpdate(
        //     { roomName: custumerInfor.roomName },
        //     {
        //         customerName: custumerInfor.customerName,
        //         month: month,
        //         year: year,
        //     }
        // ).exec();
        // await DataWaterModel.findOneAndUpdate(
        //     { roomName: custumerInfor.roomName },
        //     {
        //         customerName: custumerInfor.customerName,
        //         month: month,
        //         year: year,
        //     }
        // ).exec();
        // await DataWaterModel.findOneAndUpdate(
        //     {
        //         roomName: custumerInfor.roomName,
        //         motelID: custumerInfor.motelID,
        //     },
        //     { motelRoomID: custumerInfor.motelRoomID }
        // );
        // await DataPowerModel.findOneAndUpdate(
        //     {
        //         roomName: custumerInfor.roomName,
        //         motelID: custumerInfor.motelID,
        //     },
        //     { motelRoomID: custumerInfor.motelRoomID }
        // );

        return AppResponse.success(req, res)(roomRentalDetailNew);
    })
};
