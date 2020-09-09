import * as util from 'util';

import { By, WebElementPromise, until } from 'selenium-webdriver';

import { Browser } from '../src/browser';
import { Page } from '../src/page';

export class TheiaIDEPage extends Page {
  static PREPARING_WS_TIMEOUT_SEC = 8 * 60 * 1000;
  static LOADER_TIMEOUT_SEC = 20 * 1000;

  static NOTIFICATION_ITEM_XPATH =
    "//div[@class='theia-notification-list-item']//div[@class='theia-notification-message']";
  static NOTIFICATION_MESSAGE_EQUALS_TO_XPATH_TEMPLATE =
    "//div[@class='theia-notification-list-item']//div[@class='theia-notification-message']//span[text()='%s']";
  static NOTIFICATION_MESSAGE_CONTAINS_XPATH_TEMPLATE =
    "//div[@class='theia-notification-list-item']//div[@class='theia-notification-message']//span[contains(text(), '%s')]";

  constructor(browser: Browser) {
    super(browser);
  }

  public theiaIde: By = By.id('theia-app-shell');

  public theiaIdeTopPanel: By = By.id('theia-top-panel');

  public loader: By = By.xpath("//div[@class='theia-preload theia-hidden']");

  public testLogEditorLines = By.xpath(
    '//*[@id="code-editor-opener:file:///projects/test.log"]/div/div[1]/div[2]/div[1]/div[4]'
  );

  private getNotificationContainsXpath(messageText: string): string {
    return util.format(TheiaIDEPage.NOTIFICATION_MESSAGE_CONTAINS_XPATH_TEMPLATE, messageText);
  }

  public waitNotificationMessageContains(expectedText: string, timeout: number): WebElementPromise {
    const notificationMessage = By.xpath(this.getNotificationContainsXpath(expectedText));
    return this.browser.driver.wait(until.elementLocated(notificationMessage), timeout);
  }

  async grabTestLogContent(): Promise<string> {
    const lines = await this.browser.driver.wait(until.elementLocated(this.testLogEditorLines), 15000);
    const innerHtml = await lines.getAttribute('innerHTML');
    // convert html editor content to plain text
    const doc = new DOMParser().parseFromString(innerHtml, 'text/html');
    return doc.body.textContent || '';
  }

  async switchToIdeFrame(): Promise<void> {
    const ideWindowXpath = By.xpath("//ide-iframe[@id='ide-iframe-window' and @aria-hidden='false']");
    const ideFrameId = By.id('ide-application-iframe');

    // wait until IDE window is opened
    await this.browser.driver.wait(until.elementLocated(ideWindowXpath), TheiaIDEPage.PREPARING_WS_TIMEOUT_SEC);

    // switch to IDE frame
    const ideFrame = await this.browser.driver.wait(
      until.elementLocated(ideFrameId),
      TheiaIDEPage.PREPARING_WS_TIMEOUT_SEC
    );
    return this.browser.driver.switchTo().frame(ideFrame);
  }

  public async waitTheiaIde(): Promise<void> {
    try {
      const element = await this.browser.driver.wait(until.elementLocated(this.theiaIde));
      await this.browser.driver.wait(until.elementIsVisible(element), TheiaIDEPage.PREPARING_WS_TIMEOUT_SEC);
    } catch (err) {
      await this.switchToIdeFrame();
      const element = await this.browser.driver.wait(until.elementLocated(this.theiaIde));
      await this.browser.driver.wait(until.elementIsVisible(element), TheiaIDEPage.PREPARING_WS_TIMEOUT_SEC);
    }
  }

  public async waitTheiaIdeTopPanel(): Promise<void> {
    await this.browser.driver.wait(until.elementLocated(this.theiaIdeTopPanel), TheiaIDEPage.PREPARING_WS_TIMEOUT_SEC);
  }

  public async waitLoaderInvisibility(): Promise<void> {
    const element = await this.browser.driver.wait(until.elementLocated(this.loader));
    try {
      await this.browser.driver.wait(until.elementIsNotVisible(element), TheiaIDEPage.PREPARING_WS_TIMEOUT_SEC);
    } catch (error) {
      // not there
    }
  }

  public async waitOpenedWorkspaceIsReadyToUse(): Promise<string> {
    // switch to the IDE and wait for workspace is ready to use
    await this.switchToIdeFrame();
    await this.waitTheiaIde();
    await this.waitLoaderInvisibility();
    await this.waitTheiaIdeTopPanel();
    return this.browser.driver.getCurrentUrl();
  }
}
