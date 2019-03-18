import { ActivatedRouteStub } from '../../../src/lib/router-utils/activated-route.stub';

fdescribe('ActivatedRouteStub', () => {
  it('should provide route params', (done) => {
    const routeStub = new ActivatedRouteStub();
    routeStub.testParamMap = {param1: 'my-val', param2: 'another-val'};

    expect(routeStub.snapshot.params.param1).toEqual('my-val');
    expect(routeStub.snapshot.params.param2).toEqual('another-val');
    expect(routeStub.snapshot.paramMap.get('param1')).toEqual('my-val');
    expect(routeStub.snapshot.paramMap.get('param2')).toEqual('another-val');
    routeStub.paramMap.subscribe(paramMap => {
      routeStub.params.subscribe(params => {
        expect(paramMap.get('param1')).toEqual('my-val');
        expect(paramMap.get('param2')).toEqual('another-val');
        expect(params.param1).toEqual('my-val');
        expect(params.param2).toEqual('another-val');
        done();
      });
    });
  });

  it('should provide query params', (done) => {
    const routeStub = new ActivatedRouteStub();
    routeStub.testQueryParamMap = {param1: 'my-val', param2: 'another-val'};

    expect(routeStub.snapshot.queryParams.param1).toEqual('my-val');
    expect(routeStub.snapshot.queryParams.param2).toEqual('another-val');
    expect(routeStub.snapshot.queryParamMap.get('param1')).toEqual('my-val');
    expect(routeStub.snapshot.queryParamMap.get('param2')).toEqual('another-val');
    routeStub.queryParamMap.subscribe(paramMap => {
      routeStub.queryParams.subscribe(params => {
        expect(paramMap.get('param1')).toEqual('my-val');
        expect(paramMap.get('param2')).toEqual('another-val');
        expect(params.param1).toEqual('my-val');
        expect(params.param2).toEqual('another-val');
        done();
      });
    });
  });

  it('should provide all params', (done) => {
    const routeStub = new ActivatedRouteStub();
    routeStub.testParamMap = {pathParam: 'my-path-param'};
    routeStub.testQueryParamMap = {queryParam: 'my-query-param'};

    expect(routeStub.snapshot.params.pathParam).toEqual('my-path-param');
    expect(routeStub.snapshot.paramMap.get('pathParam')).toEqual('my-path-param');
    expect(routeStub.snapshot.queryParams.queryParam).toEqual('my-query-param');
    expect(routeStub.snapshot.queryParamMap.get('queryParam')).toEqual('my-query-param');

    routeStub.paramMap.subscribe(paramMap => {
      routeStub.params.subscribe(params => {
        routeStub.queryParamMap.subscribe(queryParamMap => {
          routeStub.queryParams.subscribe(queryParams => {
            expect(paramMap.get('pathParam')).toEqual('my-path-param');
            expect(params.pathParam).toEqual('my-path-param');
            expect(queryParamMap.get('queryParam')).toEqual('my-query-param');
            expect(queryParams.queryParam).toEqual('my-query-param');
            done();
          });
        });
      });
    });
  });

});