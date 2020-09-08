import 'reflect-metadata';

import { WebElementPromise, until, By, WebElement } from 'selenium-webdriver';

export function findBy(selector: string) {
  return (target: any, propertyKey: string) => {
    const type = Reflect.getMetadata('design:type', target, propertyKey);
    Object.defineProperty(target, propertyKey, {
        configurable: true,
        enumerable: true,
        get: function() {
          const promise = (this as any).browser.findElement(selector);
          return new type(promise, selector);
        },
    });
  };
}
