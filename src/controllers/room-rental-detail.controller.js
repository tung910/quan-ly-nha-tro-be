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
        // lấy id roomren cũ/ get customer ở roomrent cũ /rồi xóa customer
        // lấy custumer cũ gán vào roomrent mới 
        // xóa roomrent cũ
        // xóa id roomrent trong motel room

        const { DateChangeRoom, NewRoomID } = req.body;
        const roomRentalDetail = await RoomRentalDetail.findOne({ _id: req.params.id });
        return console.log(roomRentalDetail);

        //xóa chi tiết thêm phòng
        // await RoomRentalDetail.findOneAndDelete({ _id: req.params.id }).exec();

        //lấy id phòng để update id phòng
        const { customerName, userID, citizenIdentification, address, dateRange, phone, member, service, payEachTime } = roomRentalDetail[0];


        // lấy tên phòng mới 
        const motelRoom = await MotelRoomModel.find({ _id: NewRoomID });
        const nameMotelRoom = motelRoom[0].roomName;

        //lấy custumerInfor lấy dữ liệu mới 
        const custumerInfor = {
            motelRoomID: NewRoomID,
            customerName,
            roomName: nameMotelRoom,
            userID,
            citizenIdentification,
            address,
            dateRange,
            phone,
            payEachTime
        }

        //Thêm vào phòng mới   
        const roomRentalDetailNew = await RoomRentalDetail({
            ...custumerInfor,
            service,
            member,
        }).save();

        const password = await bcrypt.hash('123456789', 10);
        const account = {
            email: custumerInfor.email,
            password: password,
            role: 0,
            phone: custumerInfor.phone,
            name: custumerInfor.customerName,
            citizenIdentificationNumber: custumerInfor.citizenIdentification,
            address: custumerInfor.address,
        };
        await UserModel.create(account);

        const [day, month, year] = custumerInfor.startDate.split('/');
        await DataPowerModel.findOneAndUpdate(
            { roomName: custumerInfor.roomName },
            {
                customerName: custumerInfor.customerName,
                month: month,
                year: year,
            }
        ).exec();
        await DataWaterModel.findOneAndUpdate(
            { roomName: custumerInfor.roomName },
            {
                customerName: custumerInfor.customerName,
                month: month,
                year: year,
            }
        ).exec();
        await MotelRoomModel.findByIdAndUpdate(
            { _id: custumerInfor.motelRoomID },
            {
                isRent: true,
                customerName: custumerInfor.customerName,
                roomRentID: roomRentalDetail._id,
                avatarCustomer: custumerInfor.image,
            }
        ).exec();
        await DataWaterModel.findOneAndUpdate(
            {
                roomName: custumerInfor.roomName,
                motelID: custumerInfor.motelID,
            },
            { motelRoomID: custumerInfor.motelRoomID }
        );
        await DataPowerModel.findOneAndUpdate(
            {
                roomName: custumerInfor.roomName,
                motelID: custumerInfor.motelID,
            },
            { motelRoomID: custumerInfor.motelRoomID }
        );

        return console.log(roomRentalDetailNew);
        return AppResponse.success(req, res)(roomRentalDetailNew);
    })
};
