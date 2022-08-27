function routes(app) {
    app.use('/api', (req, res) => {
        res.json('HELLO');
    });
}
module.exports = routes;
