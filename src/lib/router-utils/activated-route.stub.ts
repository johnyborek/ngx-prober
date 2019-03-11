import { ActivatedRouteSnapshot, convertToParamMap, ParamMap, Params } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export class ActivatedRouteStub {
  private _testParams: Params = {};

  get testParamMap(): Params {
    return this._testParams;
  }

  set testParamMap(params: Params) {
    this._testParams = params;
    this.paramsSubject.next(this._testParams);
    this.paramMapSubject.next(convertToParamMap(this._testParams));
  }

  private paramMapSubject = new BehaviorSubject(convertToParamMap(this._testParams));
  paramMap: Observable<ParamMap> = this.paramMapSubject.asObservable();
  private paramsSubject = new BehaviorSubject(this._testParams);
  params: Observable<Params> = this.paramsSubject.asObservable();

  get snapshot(): ActivatedRouteSnapshot {
    return <any>{paramMap: convertToParamMap(this._testParams), params: this._testParams};
  }
}
