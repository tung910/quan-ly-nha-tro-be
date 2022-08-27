const mongoose = require('mongoose');
const logger = require('../src/helpers/logger');
const dotenv = require('dotenv');

const initEnvironment = () => {
    dotenv.config();
};

const initConnectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        logger.info('Connected to db successfully');
    } catch (error) {
        logger.error(new Error(error));
    }
};

module.exports = { initEnvironment, initConnectDB };
