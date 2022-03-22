const {
    Builder,
    By,
    until,
    WebElementCondition,
} = require('selenium-webdriver');
const utils = require('./utils');

const initDriver = async () => {
    const driver = await new Builder().forBrowser('firefox').build();
    await driver.manage().setTimeouts({ implicit: 20000 });
    await driver.manage().window().maximize();
    return driver;
};

const coreLogic = async (driver) => {
    await driver
        .wait(
            until.elementLocated(
                By.css('.header__account-info__link .dropdown__selector')
            ),
            10000
        )
        .click();
    await driver.findElement(By.linkText('My Closet')).click();

    /* Share Listings */
    const listingCards = await driver.findElements(By.css('.card'));
    for (const listing of listingCards) {
        const inventoryTagEl = await listing
            .findElement(By.css('.inventory-tag__text'))
            .catch(() => null);
        if (inventoryTagEl !== null) {
            const text = await inventoryTagEl.getText();
            if (['NOT FOR SALE', 'SOLD'].includes(text)) continue;
        }

        const title = await listing
            .findElement(By.css('.tile__title'))
            .getText();

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
                    .catch((e) => {});
            }
            await shareButton.click();
            await driver.sleep(utils.randomNum());
            await driver.findElement(By.css('.internal-share__link'));
            await driver.sleep(utils.randomNum());
            await driver.executeScript(
                "document.querySelector('.internal-share__link').click()"
            );
            console.log(`SHARED: ${title}!`);
        } catch (error) {
            console.log(`FAILED TO SHARE: ${title}!`);
            console.log(error);
            break;
        }
    }
};

const startFromLogin = async () => {
    const driver = await initDriver();

    /* Login */
    const loginPage = 'https://poshmark.com/login';
    await driver.get(loginPage);
    const username = 'lenvak';
    const password = 'Sellmystuff3!';
    await driver.findElement(By.id('login_form_username_email')).click();
    await driver
        .findElement(By.id('login_form_username_email'))
        .sendKeys(username);
    await driver.findElement(By.id('login_form_password')).sendKeys(password);
    await driver.findElement(By.css('.btn--primary')).click();

    coreLogic(driver);
};

const startFromDashboard = async () => {
    const driver = await initDriver();
    const dashboardPage = 'https://poshmark.com/feed?login=true';
    await driver.get(dashboardPage);
    coreLogic(driver);
};

startFromLogin();
// startFromDashboard();
