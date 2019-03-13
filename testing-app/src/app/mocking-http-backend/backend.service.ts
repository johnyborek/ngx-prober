import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class BackendService {

  constructor(@Inject('endpoint') private endpointUrl: string, private httpClient: HttpClient) {
  }

  public httpGet(): Observable<any> {
    return this.httpClient.get(this.endpointUrl);
  }

  public httpPost(body: any): Observable<any> {
    return this.httpClient.post(this.endpointUrl, body);
  }

  public httpPut(body: any): Observable<any> {
    return this.httpClient.put(this.endpointUrl, body);
  }

  public httpDelete(): Observable<any> {
    return this.httpClient.delete(this.endpointUrl);
  }
}
