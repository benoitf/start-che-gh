import { Browser } from "./browser";
import { Page, NewablePage } from "./page";
import { WebComponent } from "./element";

export type WaitCondition = (browser: Browser) => Promise<boolean>;

export function elementContains(locator: () => WebComponent, text: string): WaitCondition {
  return async () => { 
    const txt = await locator().getText();
    return txt === text;
  };
}

export function elementsWait(waitCondition1: WaitCondition, waitCondition2: WaitCondition): WaitCondition {
  return async () => { 
    await waitCondition1;
    await waitCondition2;
    return true;
  };
}
elementContains


export function elementIsVisible(locator: () => WebComponent): WaitCondition {
  return async () => await locator().isDisplayed();
}

export function elementIsPresent(locator: () => WebComponent): WaitCondition {
  return async () => await locator() !== undefined;
}

export function pageHasLoaded<T extends Page>(page: NewablePage<T>): WaitCondition {
  return (browser: Browser) => {
    const condition = new page(browser).loadCondition();
    return condition(browser);
  };
}