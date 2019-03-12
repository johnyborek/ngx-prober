import { asSpy, probeComponent } from '../../../../../src/index';
import { SomeService } from '../../common/sample.service';
import { ChildComponent } from './child.component';
import { TestingModule } from './testing.module';
import { TopComponent } from './top.component';

describe('ChildComponentScopeProvider', () => {
  const probe = probeComponent(TopComponent, TestingModule);

  it('should fetch provided service', () => {
    expect(probe.component).toBeTruthy();
    expect(probe.nativeElement.innerHTML.indexOf('real')).not.toEqual(-1);
    expect(probe.getFromChildComponent(SomeService, ChildComponent)).toBeTruthy();
  });
});

describe('ChildComponentScopeProvider', () => {
  const probe = probeComponent(TopComponent, TestingModule, {
    providers: [
      {provide: SomeService, component: ChildComponent, mock: true}
    ],
    fixtureInit: () => {
      asSpy(probe.getFromChildComponent(SomeService, ChildComponent).getText).and.returnValue('mock');
    }
  });

  it('should mock the service', () => {
    expect(probe.component).toBeTruthy();
    expect(probe.nativeElement.innerHTML.indexOf('mock')).not.toEqual(-1);
    expect(probe.getFromChildComponent(SomeService, ChildComponent)).toBeTruthy();
  });
});