import { Browser } from '../src/browser';
import {LoginPage} from './login-page';
import { WorkspaceJavaPage } from './workspace-java-page';
import { TheiaIDEPage } from './theia-ide-page';

export class AllPages {
    public loginPage: LoginPage;
    public theiaIDEPage: TheiaIDEPage;

    constructor(public browser: Browser, url:string) {
      this.loginPage = new LoginPage(browser);
      this.loginPage.setUrl(url);
      this.theiaIDEPage = new TheiaIDEPage(browser);
    }

    public async dispose(): Promise<void> {
      await this.browser.close();
    }
}

