import { AllPages } from '../pages';
import { Browser } from '../src/browser';
import { env } from 'process';

describe('Language Tests', () => {
  let pages: AllPages;
  let browser: Browser;
  let workspaceUrl: string;

  beforeEach(async () => {
    const url = env.CHE_WORKSPACE_URL;
    if (!url) {
      throw new Error('Missing workspace URL env variable: CHE_WORKSPACE_URL');
    }
    workspaceUrl = url;
    browser = new Browser('chrome');
    pages = new AllPages(browser, workspaceUrl);
    jest.setTimeout(500000);
  });

  it('Java workspace', async () => {
    // login first
    console.log('navigate to login page');
    await pages.loginPage.navigate();
    await pages.loginPage.signIn();

    // open workspace
    console.log('open workspace...');
    await browser.navigate(workspaceUrl);
    // wait the workspace is ready to use
    await pages.theiaIDEPage.waitOpenedWorkspaceIsReadyToUse();

    // Wait the test completed popup
    await pages.theiaIDEPage.waitNotificationMessageContains('Tests completed! See results in test.log file', 120000);

    // look at the IDE opened file to grab the result
    const result = await pages.theiaIDEPage.grabTestLogContent();
    console.log('Language test result', result);

    // expect we have expected tests
    const regexp = /TESTS[\s]PASSED:[\s](?<passed>[\d]*)\/(?<total>[\d]*)/.exec(result);
    const passed = regexp?.groups?.passed;
    const total = regexp?.groups?.total;
    expect(passed).toBe('12');
    expect(total).toBe('12');
  });

  afterEach(async () => {
    await pages.dispose();
  });
});
