const motelRoomRoute = require('./motel-room.route');
const motelRoute = require('./motel.route')

function routes(app) {
    app.use('/api/motel-room', motelRoomRoute);
    app.use('/api/motel',motelRoute)
}

module.exports = routes;
