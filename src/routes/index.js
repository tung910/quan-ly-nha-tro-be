const motelRoomRoute = require('./motel-room.route');
const userRouter = require('./user.router');

function routes(app) {
    app.use('/api/motel-room', motelRoomRoute);
    app.use('/api/users', userRouter)
}

module.exports = routes;
