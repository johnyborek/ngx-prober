import { asSpy, probeComponent } from '../../..';
import { SomeService } from '../../common/sample.service';
import { SampleDirective } from './sample.directive';
import { TestingModule } from './testing.module';
import { TopComponent } from './top.component';

describe('DirectiveScopeProvider', () => {
  const probe = probeComponent(TopComponent, TestingModule);

  it('should fetch provided service', () => {
    expect(probe.component).toBeTruthy();
    expect(probe.nativeElement.innerHTML.indexOf('real')).not.toEqual(-1);
    expect(probe.getFromDirective(SomeService, SampleDirective)).toBeTruthy();
  });
});

describe('DirectiveScopeProvider', () => {
  const probe = probeComponent(TopComponent, TestingModule, {
    providers: [
      {provide: SomeService, directive: SampleDirective, mock: true}
    ],
    fixtureInit: () => {
      asSpy(probe.getFromDirective(SomeService, SampleDirective).getText).and.returnValue('mock');
    }
  });

  it('should mock the service', () => {
    expect(probe.component).toBeTruthy();
    expect(probe.nativeElement.innerHTML.indexOf('mock')).not.toEqual(-1);
    expect(probe.getFromDirective(SomeService, SampleDirective)).toBeTruthy();
  });
});