import { convertToParamMap, ParamMap } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export class ActivatedRouteStub {
  private _testParamMap: ParamMap;
  get testParamMap() {
    return this._testParamMap;
  }

  set testParamMap(params: {}) {
    this._testParamMap = convertToParamMap(params);
    this.subject.next(this._testParamMap);
  }

  private subject = new BehaviorSubject(convertToParamMap(this.testParamMap));
  paramMap: Observable<ParamMap> = this.subject.asObservable();

  get snapshot() {
    return {paramMap: this.testParamMap};
  }
}
