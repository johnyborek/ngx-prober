import { Type } from '@angular/core';
import Spy = jasmine.Spy;
import createSpy = jasmine.createSpy;

export class Mocker {
  public static createMock<T>(type: Type<T>): T {
    const mockedInstance = {} as T;
    Mocker.getAllPrototypes(type.prototype).forEach(prototype => {
      if (typeof prototype === 'object') {
        Object.getOwnPropertyNames(prototype).forEach((name: string) => {
          Mocker.mockFunction(prototype, name, mockedInstance);
        });
      }
    });
    return mockedInstance;
  }

  private static getAllPrototypes(prototype: any): any[] {
    const prototypes: any[] = [];
    while (typeof prototype === 'object' && prototype !== Object.prototype && prototype !== Function.prototype) {
      prototypes.push(prototype);
      prototype = Object.getPrototypeOf(prototype);
    }
    return prototypes;
  }

  private static mockFunction(prototype, propertyName: string, mockedInstance) {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, propertyName);
    if (typeof descriptor.value === 'function') {
      mockedInstance[propertyName] = createSpy(propertyName);
      if (propertyName === 'constructor') {
        const functionDef = (descriptor.value as any).toString();
        propertyName = functionDef.substring('function '.length, functionDef.indexOf('('));
        mockedInstance[propertyName] = createSpy(propertyName);
      }
    }
  }

  public static castToSpy(functionRef: Function): Spy {
    if (typeof functionRef !== 'function' || !(functionRef as any).and) {
      throw new Error('Given functionRef is not a Jasmine Spy.');
    }
    return functionRef as Spy;
  }
}
