import { By, until } from 'selenium-webdriver';

import { Browser } from '../src/browser';
import { Page } from '../src/page';

export class LoginPage extends Page {
  constructor(browser: Browser) {
    super(browser);
  }

  public userName: By = By.id('username');
  public password: By = By.id('password');
  public loginButton: By = By.id('kc-login');

  public async signIn(): Promise<void> {
    const userNameElement = await this.browser.driver.wait(until.elementLocated(this.userName));
    await this.browser.driver.wait(until.elementIsVisible(userNameElement));
    await userNameElement.sendKeys('admin');
    const passwordElement = await this.browser.driver.wait(until.elementLocated(this.password));
    await passwordElement.sendKeys('admin');
    const loginButtonElement = await this.browser.driver.wait(until.elementLocated(this.loginButton));
    await loginButtonElement.click();
  }
}
