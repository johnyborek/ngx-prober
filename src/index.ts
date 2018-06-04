import { Type } from '@angular/core';
import { ComponentProbe } from './lib/component.probe/component.probe';
import { ComponentProbeConfig, defaultComponentProbeConfig } from './lib/component.probe/component.probe.config';
import { HttpServiceProbe } from './lib/http-service.probe/http-service.probe';
import { defaultHttpServiceProbeConfig, HttpServiceProbeConfig } from './lib/http-service.probe/http-service.probe.config';
import { Mocker } from './lib/mock/mocker';
import Spy = jasmine.Spy;

export * from './lib/component.probe/component.probe';
export * from './lib/component.probe/component.probe.config';
export * from './lib/http-service.probe/http-service.probe';
export * from './lib/http-service.probe/http-service.probe.config';
export * from './lib/router-utils/activated-route.stub';

function cloneDefaultConfig<T>(o: T) {
  const clone = JSON.parse(JSON.stringify(o));
  clone.fixtureInit = (<any>o).fixtureInit;
  return clone;
}

export function probeComponent<C>(componentType: Type<C>, componentModule?: Type<any>, probeConfig?: ComponentProbeConfig): ComponentProbe<C> {
  const config = Object.assign({}, cloneDefaultConfig(defaultComponentProbeConfig), probeConfig);
  return new ComponentProbe<C>(componentType, componentModule, config);
}

export function probeHttpService<S>(serviceType: Type<S>, probeConfig: HttpServiceProbeConfig): HttpServiceProbe<S> {
  const config = Object.assign({}, cloneDefaultConfig(defaultHttpServiceProbeConfig), probeConfig);
  return new HttpServiceProbe(serviceType, config);
}

export function mock<T>(type: Type<T>): T {
  return Mocker.createMock(type);
}

export function asSpy(functionRef: Function): Spy {
  return Mocker.castToSpy(functionRef);
}