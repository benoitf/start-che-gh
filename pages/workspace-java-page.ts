import { Page } from '../src/page';
import { Browser } from '../src/browser';
import { findBy } from '../src/find-by';
import { TextInput, Button, WebComponent } from '../src/element';
import { pageHasLoaded, elementIsVisible, elementsWait, elementContains } from '../src/condition';

export class WorkspaceJavaPage extends Page {
  constructor(browser: Browser) {
    super(browser);
    this.setUrl('https://che-che.192.168.64.13.nip.io/dashboard/#/ide/admin/che-java-sample-tests');
  }

  @findBy('div.theia-notification-list > div.theia-notification-message > span')
  public notificationMessage: TextInput;

  @findBy('div.view-lines')
  public editorLines: WebComponent;


  public loadCondition() {
    return elementsWait(elementIsVisible(() => this.notificationMessage), elementContains(() => this.notificationMessage, 'Tests completed! See results in test.log file'));
  }

}

