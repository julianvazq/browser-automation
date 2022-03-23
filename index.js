require('dotenv').config();
require('chromedriver');
const { By, until } = require('selenium-webdriver');
const { initDriver } = require('./driver/config');
const utils = require('./utils/utils');
const logger = require('./utils/logger');

const coreLogic = async (driver) => {
    /* Open Closet */
    try {
        await driver
            .findElement(
                By.css('.header__account-info__link .dropdown__selector')
            )
            .click();
        await driver.findElement(By.linkText('My Closet')).click();
        logger.success('Open Closet');
    } catch (error) {
        logger.error('Open Closet');
        logger.errorDefault(error);
    }

    /* Get Listings */
    let listingCards = [];
    try {
        listingCards = await driver.findElements(By.css('.card'));
        logger.success(`Get Listings (${listingCards.length})`);
    } catch (error) {
        logger.error(`Get Listings (${listingCards.length})`);
        logger.errorDefault(error);
    }

    /* Share Listings */
    let i = 1;
    for (const listing of listingCards) {
        const title = await listing
            .findElement(By.css('.tile__title'))
            .getText();

        try {
            const inventoryTagEl = await listing
                .findElement(By.css('.inventory-tag__text'))
                .catch(() => null);
            // if (inventoryTagEl !== null) {
            //     const text = await inventoryTagEl.getText();
            //     if (['NOT FOR SALE', 'SOLD'].includes(text)) {
            //         logger.info(`(${i}) ${title} skipped`);
            //         continue;
            //     }
            // }
        } catch (error) {
            logger.error(`(${i}) Check Inventory Tag`);
            logger.errorDefault(error);
        }

        try {
            const shareButton = await listing.findElement(
                By.css('.social-action-bar__share')
            );
            let externalShareContainer = null;
            await driver
                .findElement(By.css('.external-share-container'))
                .then((element) => {
                    externalShareContainer = element;
                })
                .catch(() => {
                    externalShareContainer = null;
                });
            if (externalShareContainer !== null) {
                await driver
                    .wait(until.elementIsNotVisible(externalShareContainer))
                    .catch(() => {});
            }

            await driver.sleep(utils.randomNum(2000, 4000));
            await shareButton.click();

            await driver.findElement(By.css('.internal-share__link'));

            await driver.sleep(utils.randomNum(1000, 3000));
            await driver.executeScript(
                "document.querySelector('.internal-share__link').click()"
            );
            logger.success(`(${i}) ${title} - shared`);
        } catch (error) {
            logger.error(`(${i}) ${title}- not shared`);
            logger.errorDefault(error);
        } finally {
            i++;
        }
    }
};

const startFromLogin = async () => {
    const driver = await initDriver();
    /* Login */
    try {
        const loginPage = 'https://poshmark.com/login';
        await driver.get(loginPage);
        const username = process.env.USER;
        const password = process.env.PASSWORD;
        await driver.findElement(By.id('login_form_username_email')).click();
        await driver
            .findElement(By.id('login_form_username_email'))
            .sendKeys(username);
        await driver
            .findElement(By.id('login_form_password'))
            .sendKeys(password);
        await driver.findElement(By.css('.btn--primary')).click();
        logger.success('Login');
    } catch (error) {
        logger.error('Login');
        logger.errorDefault(error);
    }

    await coreLogic(driver);
    driver.quit();
};

const startFromDashboard = async () => {
    const driver = await initDriver();
    try {
        const dashboardPage = 'https://poshmark.com/feed?login=true';
        await driver.get(dashboardPage);
        logger.success('Navigate to Dashboard');
    } catch (error) {
        logger.error('Navigate to Dashboard');
        logger.errorDefault(error);
    }

    await coreLogic(driver);
    driver.quit();
};

startFromLogin();
// startFromDashboard();
