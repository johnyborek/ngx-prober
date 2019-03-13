import { Mocker } from '../../../src/lib/mock/mocker';

class ParentClass {
  public parentFunction() {}
  protected parentProtectedFunction() {}
}

class ChildClass extends ParentClass {
  public childFunction() {}
  protected childProtectedFunction() {}
}

describe('mock', () => {
  it('should create', () => {
    const m = Mocker.createMock(ChildClass);
    m.childFunction();
    m.parentFunction();
  });
});