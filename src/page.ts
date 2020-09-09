import { Browser } from './browser';

export interface NewablePage<T extends Page> {
  new (browser: Browser): T;
}

export abstract class Page {
  private url: string;

  public setUrl(url: string): void {
    this.url = url;
  }

  public async navigate(): Promise<void> {
    await this.browser.navigate(this.url);
  }

  public constructor(protected browser: Browser) {}
}
