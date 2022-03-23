const { Builder } = require('selenium-webdriver');
const logger = require('../utils/logger');

const initDriver = async () => {
    try {
        const driver = await new Builder().forBrowser('chrome').build();
        await driver.manage().setTimeouts({ implicit: 20000 });
        await driver.manage().window().maximize();
        return driver;
    } catch (error) {
        logger.error('Initialize driver');
        logger.errorDefault(error);
    }
};

module.exports = {
    initDriver,
};
