import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub, probeComponent } from '../../../../src/index';
import { TestingModule } from './testing.module';
import { TopComponent } from './top.component';

describe('ActivatedRouteStub', () => {
  const probe = probeComponent(TopComponent, TestingModule, {
    providers: [
      {provide: ActivatedRoute, useClass: ActivatedRouteStub}
    ],
    fixtureInit: () => {
      const activatedRouteStub: ActivatedRouteStub = probe.get(ActivatedRoute) as any;
      activatedRouteStub.testParamMap = {myUrlParam: 'my-param-value'};
    }
  });

  it('should retrieve URL param from snapshot', () => {
    expect(probe.queryAllByCss('span')[0].nativeElement.innerHTML).toEqual('my-param-value');
  });

  it('should retrieve URL param from Observable', () => {
    expect(probe.queryAllByCss('span')[1].nativeElement.innerHTML).toEqual('my-param-value');
  });
});
