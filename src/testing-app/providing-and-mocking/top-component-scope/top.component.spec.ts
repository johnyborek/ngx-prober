import { asSpy, probeComponent } from '../../..';
import { SomeService } from '../../common/sample.service';
import { TestingModule } from './testing.module';
import { TopComponent } from './top.component';

describe('TopComponentScopeProvider', () => {
  const probe = probeComponent(TopComponent, TestingModule);

  it('should fetch provided service', () => {
    expect(probe.component).toBeTruthy();
    expect(probe.nativeElement.innerHTML.indexOf('real')).not.toEqual(-1);
    expect(probe.get(SomeService)).toBeTruthy();
  });
});

describe('TopComponentScopeProvider', () => {
  const probe = probeComponent(TopComponent, TestingModule, {
    providers: [
      {provide: SomeService, component: TopComponent, mock: true}
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