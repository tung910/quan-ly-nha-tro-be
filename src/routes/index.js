const motelRoomRoute = require('./motel-room.route');

function routes(app) {
    app.use('/api/motel-room', motelRoomRoute);
}

module.exports = routes;
