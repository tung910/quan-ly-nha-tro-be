const motelRoomRoute = require('./motel-room.route');
const motelRoute = require('./motel.route');
const userRouter = require('./user.router');
const customerRoute = require('./customer.route');
const serviceRoute = require('./service.route');
const powerRoute = require('./power.route');

function routes(app) {
    app.use('/api', userRouter);
    app.use('/api/motel-room', motelRoomRoute);
    app.use('/api/motel', motelRoute);
    app.use('/api/customer', customerRoute);
    app.use('/api/service', serviceRoute);
    app.use('/api/power',powerRoute)
}

module.exports = routes;
