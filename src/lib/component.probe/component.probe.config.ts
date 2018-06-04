import { Type } from '@angular/core';

export interface ComponentProbeConfig {
  providers?: any[];
  fixtureInit?: () => void;
  modules?: Type<any>[];
  mockedComponents?: Type<any>[];
  declarations?: Type<any>[];
  includeNoopAnimationModule?: boolean;
  detectChangesOnInit?: boolean;
}

export const defaultComponentProbeConfig: ComponentProbeConfig = {
  providers: [],
  fixtureInit: () => {},
  modules: [],
  mockedComponents: [],
  declarations: [],
  includeNoopAnimationModule: true,
  detectChangesOnInit: true
};