import { Type } from '@angular/core';

export interface HttpServiceProbeConfig {
  providers?: any[];
  fixtureInit?: () => void;
  modules?: Array<Type<any>>;
  autoVerifyHttpCalls?: boolean;
}

export const defaultHttpServiceProbeConfig: HttpServiceProbeConfig = {
  providers: [],
  fixtureInit: () => {},
  modules: [],
  autoVerifyHttpCalls: true,
};
