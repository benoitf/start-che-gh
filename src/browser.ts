import 'chromedriver';
import { Builder, ThenableWebDriver, WebElement, By, WebElementPromise } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';
//import { Options } from 'selenium-webdriver/firefox';
import { WaitCondition } from './condition';
import { PageLoadStrategy } from 'selenium-webdriver/lib/capabilities';

export class Browser {
  public driver: ThenableWebDriver;
  public constructor(private browserName: string) {
    const options: Options = new Options().addArguments('--ignore-certificate-errors').addArguments("--disabledev-shm-usage");
    options.addArguments("enable-automation");
    options.addArguments("--headless");
    options.addArguments("--window-size=1920,1080");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-extensions");
    options.addArguments("--dns-prefetch-disable");
    options.addArguments("--disable-gpu");
    options.setPageLoadStrategy(PageLoadStrategy.NORMAL);
    options.addArguments("enable-features=NetworkServiceInProcess");
    options.addArguments("--disable-browser-side-navigation");
    //options.addArguments("disable-features=NetworkService") 
    this.driver = new Builder().forBrowser(browserName).setChromeOptions(options).build();
    //const options: Options = new Options().headless();
    //options.addArguments('--ignore-certificate-errors').headless().addArguments("--no-sandbox", "--disable-gpu", "--disabledev-shm-usage", "--disable-extensions");
    //this.driver = new Builder().forBrowser(browserName).withCapabilities(new Options().setAcceptInsecureCerts(true)).setFirefoxOptions(options).build();
  }

  public async navigate(url: string): Promise<void> {
    await this.driver.navigate().to(url);
  }

  public findElement(selector: string): WebElementPromise {
    return this.driver.findElement(By.css(selector));
  }

  public async clearCookies(url?: string): Promise<void> {
    if (url) {
      const currentUrl = await this.driver.getCurrentUrl();
      await this.navigate(url);
      await this.driver.manage().deleteAllCookies();
      await this.navigate(currentUrl);
    } else {
      await this.driver.manage().deleteAllCookies();
    }
  }

  public async wait(condition: WaitCondition) {
    await this.waitAny(condition);
  }

  public async waitAny(conditions: WaitCondition | WaitCondition[]): Promise<void> {
    const all = (!(conditions instanceof Array)) ? [ conditions ] : conditions;

    await this.driver.wait(async () => {
      for (const condition of all) {
        try {
          if (await condition(this) === true) {
            return true;
          }
          continue;
        } catch (ex) {
          continue;
        }
      }
      return false;
    });
  }

  public async close(): Promise<void> {
    await this.driver.quit();
  }
}