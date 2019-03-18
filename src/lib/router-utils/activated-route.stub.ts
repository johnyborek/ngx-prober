import { ActivatedRouteSnapshot, convertToParamMap, ParamMap, Params } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export class ActivatedRouteStub {
  private testParams: Params = {};
  private testQueryParams: Params = {};

  get testParamMap(): Params {
    return this.testParams;
  }

  set testParamMap(params: Params) {
    this.testParams = params;
    this.paramsSubject.next(this.testParams);
    this.paramMapSubject.next(convertToParamMap(this.testParams));
  }

  get testQueryParamMap(): Params {
    return this.testQueryParams;
  }

  set testQueryParamMap(queryParams: Params) {
    this.testQueryParams = queryParams;
    this.queryParamsSubject.next(this.testQueryParams);
    this.queryParamMapSubject.next(convertToParamMap(this.testQueryParams));
  }

  private paramMapSubject = new BehaviorSubject(convertToParamMap(this.testParams));
  public paramMap: Observable<ParamMap> = this.paramMapSubject.asObservable();
  private paramsSubject = new BehaviorSubject(this.testParams);
  public params: Observable<Params> = this.paramsSubject.asObservable();

  private queryParamMapSubject = new BehaviorSubject(convertToParamMap(this.testQueryParams));
  public queryParamMap: Observable<ParamMap> = this.queryParamMapSubject.asObservable();
  private queryParamsSubject = new BehaviorSubject(this.testQueryParams);
  public queryParams: Observable<Params> = this.queryParamsSubject.asObservable();

  get snapshot(): ActivatedRouteSnapshot {
    return {
      paramMap: convertToParamMap(this.testParams),
      params: this.testParams,
      queryParamMap: convertToParamMap(this.testQueryParamMap),
      queryParams: this.testQueryParams
    } as any;
  }
}
