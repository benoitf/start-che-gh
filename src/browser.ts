import { Builder, ThenableWebDriver } from 'selenium-webdriver';

import { Options } from 'selenium-webdriver/chrome';
import { PageLoadStrategy } from 'selenium-webdriver/lib/capabilities';

export class Browser {
  public driver: ThenableWebDriver;
  public constructor(private browserName: string) {
    const options: Options = new Options()
      .addArguments('--ignore-certificate-errors')
      .addArguments('--disabledev-shm-usage')
      .addArguments('enable-automation')
      .addArguments('--window-size=1920,1080')
      .addArguments('--no-sandbox')
      .addArguments('--disable-extensions')
      .addArguments('--dns-prefetch-disable')
      .addArguments('--disable-gpu')
      .addArguments('enable-features=NetworkServiceInProcess')
      .addArguments('--disable-browser-side-navigation');
    options.setPageLoadStrategy(PageLoadStrategy.NORMAL);
    this.driver = new Builder().forBrowser(browserName).setChromeOptions(options).build();
  }

  public async navigate(url: string): Promise<void> {
    await this.driver.navigate().to(url);
  }

  public async close(): Promise<void> {
    await this.driver.quit();
  }
}
