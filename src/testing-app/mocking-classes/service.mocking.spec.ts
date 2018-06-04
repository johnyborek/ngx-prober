import { asSpy, mock } from '../..';
import { SomeService } from '../common/sample.service';

describe('MockingServices', () => {
  it('should create mock by class', () => {
    const serviceMock = mock(SomeService);
    expect(serviceMock.getText).toBeTruthy();
    expect(serviceMock.getText()).toBeUndefined();
  });

  it('should instrument mock function', () => {
    const serviceMock = mock(SomeService);
    asSpy(serviceMock.getText).and.returnValue('mocked');
    expect(serviceMock.getText()).toEqual('mocked');
  });
});
