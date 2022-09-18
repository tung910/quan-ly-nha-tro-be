const motelRoomRoute = require('./motel-room.route');
const userRouter = require('./user.router');
const customerRoute = require('./customer.route');
const serviceRoute = require('./service.route');

function routes(app) {
    app.use('/api', userRouter);
    app.use('/api/motel-room', motelRoomRoute);
    app.use('/api/customer', customerRoute);
    app.use('/api/service', serviceRoute);
}

module.exports = routes;
