import { probeComponent } from '../../../../src/index';
import { SomeService } from '../common/sample.service';
import { ChildComponent } from './child.component';
import { TestingModule } from './testing.module';
import { TopComponent } from './top.component';

describe('Component mocks', () => {
  const probe = probeComponent(TopComponent, TestingModule, {
    providers: [
      {provide: SomeService, component: ChildComponent, mock: true}
    ],
    mockedComponents: [ChildComponent]
  });

  it('should create', () => {
    expect(probe.component).toBeTruthy();
    expect(probe.nativeElement.innerHTML.indexOf('mock')).not.toEqual(-1);
  });
});
