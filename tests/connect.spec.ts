import { Browser } from '../src/browser';
import { ensure } from '../src/ensure';

import { Builder, ThenableWebDriver, WebElement, By, WebElementPromise, until } from 'selenium-webdriver';
import { AllPages } from '../pages';
import { pageHasLoaded } from '../src/condition';
import { WorkspaceJavaPage } from '../pages/workspace-java-page';
import { env } from 'process';

describe('Submit ideas', () => {
  let pages: AllPages;
  let browser: Browser;

  function timeout(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  beforeEach(async () => {
    browser = new Browser('chrome')
    pages = new AllPages(browser);
    jest.setTimeout(180000);

  });

  it('Java workspace', async () => {

    await pages.loginPage.navigate();
    await pages.loginPage.signIn();

    // open workspace
    const workspaceUrl: string | undefined = env.CHE_WORKSPACE_URL;
    expect(workspaceUrl).toBeDefined();
    await browser.navigate(workspaceUrl!);

    // wait the workspace is ready to use
    await pages.theiaIDEPage.waitOpenedWorkspaceIsReadyToUse();

    // Wait the test completed popup
    const notificationMessageEnd = await pages.theiaIDEPage.waitNotificationMessageContains('Tests completed! See results in test.log file', 120000);

    
    // look at the IDE opened file to grab the result
    const xpathLines = By.xpath('//*[@id="code-editor-opener:file:///projects/test.log"]/div/div[1]/div[2]/div[1]/div[4]');
    const lines = await browser.driver.wait(until.elementLocated(xpathLines), 15000);

    // convert html editor content to plain text
    const innerHtml = await lines.getAttribute("innerHTML");
    const doc = new DOMParser().parseFromString(innerHtml, 'text/html');
    const result = doc.body.textContent || "";

    console.log('result is' + result);
    
    const regexp = /TESTS[\s]PASSED:[\s](?<passed>[\d]*)\/(?<total>[\d]*)/.exec(result);
    
    const passed = regexp?.groups?.passed;
    const total = regexp?.groups?.total;
   
    // expect we have expected tests
    expect(passed).toBe('12');
    expect(total).toBe('12');

  });


  afterEach(async () => {
    await pages.dispose();
  });
});
