import { Type } from '@angular/core';

export interface ComponentProbeConfig {
  providers?: any[];
  fixtureInit?: () => void;
  modules?: Array<Type<any>>;
  mockedComponents?: Array<Type<any>>;
  declarations?: Array<Type<any>>;
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
  detectChangesOnInit: true,
};
