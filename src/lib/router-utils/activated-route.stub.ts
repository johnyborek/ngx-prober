import { ActivatedRouteSnapshot, convertToParamMap, ParamMap, Params } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export class ActivatedRouteStub {
  private testParams: Params = {};

  get testParamMap(): Params {
    return this.testParams;
  }

  set testParamMap(params: Params) {
    this.testParams = params;
    this.paramsSubject.next(this.testParams);
    this.paramMapSubject.next(convertToParamMap(this.testParams));
  }

  private paramMapSubject = new BehaviorSubject(convertToParamMap(this.testParams));
  public paramMap: Observable<ParamMap> = this.paramMapSubject.asObservable();
  private paramsSubject = new BehaviorSubject(this.testParams);
  public params: Observable<Params> = this.paramsSubject.asObservable();

  get snapshot(): ActivatedRouteSnapshot {
    return { paramMap: convertToParamMap(this.testParams), params: this.testParams } as any;
  }
}
