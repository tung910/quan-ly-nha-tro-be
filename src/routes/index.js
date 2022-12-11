const motelRoomRoute = require('./motel-room.route');
const motelRoute = require('./motel.route');
const userRoute = require('./user.route');
const customerRoute = require('./customer.route');
const serviceRoute = require('./service.route');
const roomRentalDetailRouter = require('./room-rental-detail.route');
const powerRoute = require('./data-power.route');
const waterRoute = require('./water.route');
const calculatorMoneyRoute = require('./calculator-money.route');
const revenueStatisticsRoute = require('./revenue-statistics.route');
const roomDepositRoute = require('./room-deposit.route');
const notificationRoute = require('./notification.route');

const { exportWordContract } = require('~/services/export.service');

function routes(app) {
    app.use('/', (req, res) => {
        return res.status(403).json({
            status_code: 403,
            messages: 'Forbidden',
        });
    });
    app.use('/api', userRoute);
    app.use('/api/motel-room', motelRoomRoute);
    app.use('/api/motel', motelRoute);
    app.use('/api/customer', customerRoute);
    app.use('/api/service', serviceRoute);
    app.use('/api/room-rental-detail', roomRentalDetailRouter);
    app.use('/api/data-power', powerRoute);
    app.use('/api/data-water', waterRoute);
    app.use('/api/calculator-money', calculatorMoneyRoute);
    app.use('/api/revenue-statistics', revenueStatisticsRoute);
    app.use('/api/room-deposit', roomDepositRoute);
    app.use('/api/notifications', notificationRoute);

    app.get('/api/export-word-contract/:rentalId', exportWordContract);
    app.post('/api/upload-img', (req, res) => {
        res.json(200);
    });
}

module.exports = routes;
