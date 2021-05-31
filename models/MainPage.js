const assert = require('assert');

const pageUrl = 'https://pik-broker.ru/';
const loginLocator = 'xpath=//button[contains(@class, "header_lk_icon")]';
const phoneInputLocator = '[name=user-phone]:visible';
const smsConfirmationButtonLocator = '[class*="login_button"]:visible';
const createAccountLocator = '[class*="login_link"]:visible';
const userNameInputLocator = '[name=user-name]:visible';

class MainPage {
    constructor(page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto(pageUrl);
        assert.match(await this.page.title(), /ПИК-Брокер/);
    }

    async openLoginPopUp() {
        console.log('Нажимаем на иконку Личного кабинета');
        await this.page.click(loginLocator);
    }

    async insertPhoneValue(phoneNumber) {
        console.log('Вводим номер телефона');
        await this.page.fill(phoneInputLocator, phoneNumber);
    }

    async sendSMSCode() {
        console.log('Кликаем на "Получить код"');
        await this.page.click(smsConfirmationButtonLocator);
    }

    async clickOnCreateAccount() {
        console.log('Кликаем на "Еще нет аккаунта?"');
        await this.page.click(createAccountLocator);
    }

    async insertUserName(userName) {
        console.log('Вводим имя нового пользователя');
        await this.page.fill(userNameInputLocator, userName);
    }
}

module.exports = { MainPage };