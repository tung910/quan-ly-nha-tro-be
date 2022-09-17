const motelRoomRoute = require('./motel-room.route');
const motelRoute = require('./motel.route');
const userRouter = require('./user.router');
const customerRoute = require('./customer.route');

function routes(app) {
    app.use('/api/motel-room', motelRoomRoute);
    app.use('/api/customer', customerRoute);
    app.use('/api', userRouter);
    app.use('/api/motel',motelRoute);
}

module.exports = routes;
