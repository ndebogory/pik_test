//@ts-check

const { it } = require('mocha');
const { describe } = require('mocha');
const { chromium } = require('playwright');
const expect = require('expect');
const { MainPage } = require('./models/MainPage');

let browser;
let page, mainPage;

describe('LK pop-up', function () {

    before(async() => {
        browser = await chromium.launch({
            headless: true,
            slowMo: 100,
        });
    });
    after(async () => {
        await browser.close();
    });

    beforeEach(async() => {
        page = await browser.newPage();
        mainPage = new MainPage(page);
        await  mainPage.navigate();
    });
    afterEach(async () => {
        await page.close();
    });

    it('should get error on sending code without phone number', async (shortName = 'no_phone') => {
        await mainPage.openLoginPopUp();

        await mainPage.sendSMSCode();

        const errorBlock = await page.innerText('.error >> .formError');
        await screenCapture(shortName);
        expect(errorBlock).toBe('Пожалуйста, заполните это поле.');
    })

    it('should get error on sending code for non user phone', async (shortName = 'no_user') => {
        await mainPage.openLoginPopUp();
        await mainPage.insertPhoneValue('90100000000');

        await mainPage.sendSMSCode();

        const errorBlock = await page.innerText('.error >> .formError');
        await screenCapture(shortName);
        expect(errorBlock).toBe('Пользователь не найден.');
    })

    it('should oped code filed on sending code with user phone', async (shortName = 'login') => {
        await mainPage.openLoginPopUp();
        await mainPage.insertPhoneValue('90000000000');

        await mainPage.sendSMSCode();

        await page.waitForSelector('xpath=//*[contains(@class, "login_smsBlock")]');
        const smsBlock = await page.isVisible('xpath=//*[contains(@class, "login_smsBlock")]');
        await screenCapture(shortName);
        expect(smsBlock).toBeTruthy();
    })

    it('should create new user', async (shortName = 'user_creation') => {
        await mainPage.openLoginPopUp();
        await mainPage.clickOnCreateAccount();
        await mainPage.insertUserName('Тест')
        await mainPage.insertPhoneValue('1111111115');

        await mainPage.sendSMSCode();

        await page.waitForSelector('xpath=//*[contains(@class, "login_smsBlock")]');
        const smsBlock = await page.isVisible('xpath=//*[contains(@class, "login_smsBlock")]');
        await screenCapture(shortName);
        expect(smsBlock).toBeTruthy();
    })
});

async function screenCapture(testName) {
    await page.screenshot({
        path: './screenshots/screenshot-' + testName + '.png',
    });
}