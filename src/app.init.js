const mongoose = require('mongoose');
const dotenv = require('dotenv');
const logger = require('~/helpers/logger');

const initEnvironment = () => {
    dotenv.config();
};

const initConnectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        logger.info('Connected to db successfully');
    } catch (error) {
        logger.error(new Error(error));
    }
};

module.exports = { initEnvironment, initConnectDB };
