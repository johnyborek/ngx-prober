import { probeHttpService } from '../../../../src/index';
import { BackendService } from './backend.service';

describe('BackendService', () => {
  const sampleBody = {foo: 'bar'};
  const probe = probeHttpService(BackendService, {
      providers: [
        {provide: 'endpoint', useValue: 'http://my-url.com/my-resource'}
      ]
    }
  );

  it('should call GET', () => {
    probe.service.httpGet().subscribe(
      (result) => {
        expect(result).toEqual(sampleBody);
      }
    );

    probe.expectGet('http://my-url.com/my-resource', sampleBody);
  });

  it('should call POST', () => {
    probe.service.httpPost(sampleBody).subscribe(
      (result) => {
        expect(result).toEqual('');
      }
    );

    probe.expectPost('http://my-url.com/my-resource', sampleBody);
  });

  it('should call PUT', () => {
    probe.service.httpPut(sampleBody).subscribe(
      (result) => {
        expect(result).toEqual('');
      }
    );

    probe.expectPut('http://my-url.com/my-resource', sampleBody);
  });

  it('should call DELETE', () => {
    probe.service.httpDelete().subscribe(
      (result) => {
        expect(result).toEqual('');
      }
    );

    probe.expectDelete('http://my-url.com/my-resource');
  });

  it('should handle GET error', () => {
    probe.service.httpGet().subscribe(
      (result) => {
        fail();
      },
      (error) => {
        expect(error.status).toEqual(500);
      }
    );

    probe.expectGetError('http://my-url.com/my-resource', 500);
  });

  it('should handle POST error', () => {
    probe.service.httpPost(sampleBody).subscribe(
      (result) => {
        fail();
      },
      (error) => {
        expect(error.status).toEqual(500);
      }
    );

    probe.expectPostError('http://my-url.com/my-resource', sampleBody, 500);
  });

  it('should handle PUT error', () => {
    probe.service.httpPut(sampleBody).subscribe(
      (result) => {
        fail();
      },
      (error) => {
        expect(error.status).toEqual(500);
      }
    );

    probe.expectPutError('http://my-url.com/my-resource', sampleBody, 500);
  });

  it('should handle DELETE error', () => {
    probe.service.httpDelete().subscribe(
      (result) => {
        fail();
      },
      (error) => {
        expect(error.status).toEqual(500);
      }
    );

    probe.expectDeleteError('http://my-url.com/my-resource', 500);
  });
});

