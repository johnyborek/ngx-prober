import { ActivatedRouteStub } from '../../../src/lib/router-utils/activated-route.stub';

describe('ActivatedRouteStub', () => {
  it('should provide route params', (done) => {
    const routeStub = new ActivatedRouteStub();
    routeStub.testParamMap = {param1: 'my-val', param2: 'another-val'};

    expect(routeStub.snapshot.params['param1']).toEqual('my-val');
    expect(routeStub.snapshot.params['param2']).toEqual('another-val');
    expect(routeStub.snapshot.paramMap.get('param1')).toEqual('my-val');
    expect(routeStub.snapshot.paramMap.get('param2')).toEqual('another-val');
    routeStub.paramMap.subscribe(paramMap => {
      routeStub.params.subscribe(params => {
        expect(paramMap.get('param1')).toEqual('my-val');
        expect(paramMap.get('param2')).toEqual('another-val');
        expect(params['param1']).toEqual('my-val');
        expect(params['param2']).toEqual('another-val');
        done();
      });
    });
  });
});