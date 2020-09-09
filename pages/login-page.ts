import { Page } from '../src/page';
import { Browser } from '../src/browser';
import { findBy } from '../src/find-by';
import { TextInput, Button, WebComponent } from '../src/element';
import { pageHasLoaded, elementIsVisible } from '../src/condition';

export class LoginPage extends Page {
  constructor(browser: Browser) {
    super(browser);
    this.setUrl(`https://che-che.192.168.64.13.nip.io`);
  }

  @findBy('input#username')
  public userName: TextInput;

  @findBy('input#password')
  public password: TextInput;
  
  @findBy('input#kc-login')
  public loginButton: Button;
  
  public loadCondition() {
    return elementIsVisible(() => this.userName);
  }

  public async signIn(): Promise<void> {
    await this.browser.wait(pageHasLoaded(LoginPage),);
    await this.userName.type('admin');
    await this.password.type('admin');
    await this.loginButton.click();
  }
}