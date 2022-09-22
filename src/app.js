require('module-alias/register');
const express = require('express');
const cors = require('cors');

const { initEnvironment, initConnectDB } = require('./app.init');
const routes = require('~/routes');
const logger = require('./helpers/logger');

const app = express();
initEnvironment();
initConnectDB();
if (process.env.NODE_ENV === 'development') {
    const morgan = require('morgan');
    app.use(morgan('tiny'));
}
app.use(cors());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.urlencoded({ limit: '50mb' }));
// app.use(express.json({ limit: '50mb' }));

routes(app);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
    logger.info('Server is listening port: http://localhost:' + PORT)
);
