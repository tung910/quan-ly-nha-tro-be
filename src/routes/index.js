const motelRoomRoute = require('./motel-room.route');
const userRouter = require('./user.router');
const customerRoute = require('./customer.route');

function routes(app) {
    app.use('/api/motel-room', motelRoomRoute);
    app.use('/api/customer', customerRoute);
}

module.exports = routes;
