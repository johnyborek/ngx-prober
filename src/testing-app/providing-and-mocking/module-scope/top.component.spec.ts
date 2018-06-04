import { asSpy, probeComponent } from '../../..';
import { SomeService } from '../../common/sample.service';
import { TestingModule } from './testing.module';
import { TopComponent } from './top.component';

describe('ModuleScopeProvider', () => {
  const probe = probeComponent(TopComponent, TestingModule);

  it('should fetch provided service', () => {
    expect(probe.component).toBeTruthy();
    expect(probe.nativeElement.innerHTML.indexOf('real')).not.toEqual(-1);
    expect(probe.get(SomeService)).toBeTruthy();
  });
});

describe('ModuleScopeProvider', () => {
  const probe = probeComponent(TopComponent, TestingModule, {
    providers: [
      {provide: SomeService, mock: true}
    ],
    fixtureInit: () => {
      asSpy(probe.get(SomeService).getText).and.returnValue('mock');
    }
  });

  it('should mock the service', () => {
    expect(probe.component).toBeTruthy();
    expect(probe.nativeElement.innerHTML.indexOf('mock')).not.toEqual(-1);
    expect(probe.get(SomeService)).toBeTruthy();
  });
});

describe('ModuleScopeProvider', () => {
  class StubService {
    getText() {
      return 'useStubClass';
    }
  }

  const probe = probeComponent(TopComponent, TestingModule, {
    providers: [
      {provide: SomeService, useClass: StubService}
    ]
  });

  it('should provide by class', () => {
    expect(probe.component).toBeTruthy();
    expect(probe.nativeElement.innerHTML.indexOf('useStubClass')).not.toEqual(-1);
    expect(probe.get(SomeService)).toBeTruthy();
  });
});

describe('ModuleScopeProvider', () => {
  const stubService = {
    getText: () => {
      return 'useStubValue';
    }
  };

  const probe = probeComponent(TopComponent, TestingModule, {
    providers: [
      {provide: SomeService, useValue: stubService}
    ]
  });

  it('should provide by value', () => {
    expect(probe.component).toBeTruthy();
    expect(probe.nativeElement.innerHTML.indexOf('useStubValue')).not.toEqual(-1);
    expect(probe.get(SomeService)).toBeTruthy();
  });
});