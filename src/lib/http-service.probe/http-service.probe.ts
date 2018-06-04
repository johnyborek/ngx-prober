import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { mock } from '../..';
import { HttpServiceProbeConfig } from './http-service.probe.config';

class HttpServiceProbeInitializer<S> {
  private testBed: typeof TestBed;

  constructor(private serviceType: Type<S>, private config: HttpServiceProbeConfig) {
  }

  init(): typeof TestBed {
    this.createProviderMocks();
    this.setupHttpClient();
    this.configureTestingModule();
    return this.testBed;
  }

  private createProviderMocks(): void {
    this.config.providers.forEach((provider) => {
      if (provider.mock === true) {
        provider.useValue = mock(provider.provide);
      }
    });
  }

  private setupHttpClient(): void {
    if (this.config.modules.indexOf(HttpClientModule) !== -1) {
      this.config.autoVerifyHttpCalls = false;
    } else if (this.config.modules.indexOf(HttpClientTestingModule) === -1) {
      this.config.modules.push(HttpClientTestingModule);
    }
  }

  private configureTestingModule(): void {
    this.testBed = TestBed.configureTestingModule({
      imports: <any>this.config.modules,
      providers: [this.serviceType, ...this.config.providers]
    });
  }
}

export interface ResponseOptions {
  headers?: HttpHeaders | {
    [name: string]: string | string[];
  };
  status?: number;
  statusText?: string;
}

export class HttpServiceProbe<S> {
  testBed: typeof TestBed;
  service: S;
  httpController: HttpTestingController;

  constructor(private serviceType: Type<S>, private config?: HttpServiceProbeConfig) {
    beforeEach(() => {
      this.testBed = new HttpServiceProbeInitializer(serviceType, config).init();
      this.config.fixtureInit();
      this.service = TestBed.get(this.serviceType);
      if (this.config.modules.indexOf(HttpClientTestingModule) !== -1) {
        this.httpController = TestBed.get(HttpTestingController);
      }
    });

    afterEach(() => {
      if (this.config.autoVerifyHttpCalls) {
        this.httpController.verify();
      }
    });
  }

  get<T>(type: Type<T>): T {
    return this.testBed.get(type);
  }

  expect(method: string, url: string, requestBody?: any, responseBody: any = '',
         options: ResponseOptions = {}): TestRequest {
    const testRequest = this.httpController.expectOne(url);
    expect(testRequest.request.method).toEqual(method);
    if (requestBody) {
      expect(testRequest.request.body).toEqual(requestBody);
    }
    testRequest.flush(responseBody, options);
    return testRequest;
  }

  expectSuccess(method: string, url: string, requestBody?: any, responseBody?: any,
                contentType = 'application/json', accept = 'application/json'): TestRequest {
    let headers = new HttpHeaders();
    if (accept) {
      headers = headers.append('Accept', accept);
    }
    if (contentType) {
      headers = headers.append('Content-Type', contentType);
    }
    return this.expect(method, url, requestBody, responseBody, {headers: headers});
  }

  expectGet(url: string, responseBody: any, accept = 'application/json'): TestRequest {
    return this.expectSuccess('GET', url, undefined, responseBody, undefined, accept);
  }

  expectPost(url: string, requestBody: any, contentType = 'application/json', accept = 'application/json', responseBody?: any): TestRequest {
    return this.expectSuccess('POST', url, requestBody, responseBody, contentType, accept);
  }

  expectPut(url: string, requestBody: any, contentType = 'application/json', accept = 'application/json', responseBody?: any): TestRequest {
    return this.expectSuccess('PUT', url, requestBody, responseBody, contentType, accept);
  }

  expectDelete(url: string, accept = 'application/json', responseBody?: any): TestRequest {
    return this.expectSuccess('DELETE', url, undefined, responseBody, undefined, accept);
  }

  expectError(method: string, url: string, requestBody: any, responseStatus: number): TestRequest {
    const options: ResponseOptions = {
      status: responseStatus,
      statusText: 'Fake error body'
    };
    return this.expect(method, url, requestBody, undefined, options);
  }

  expectGetError(url: string, responseStatus: number): TestRequest {
    return this.expectError('GET', url, undefined, responseStatus);
  }

  expectPostError(url: string, requestBody: any, responseStatus: number): TestRequest {
    return this.expectError('POST', url, requestBody, responseStatus);
  }

  expectPutError(url: string, requestBody: any, responseStatus: number): TestRequest {
    return this.expectError('PUT', url, requestBody, responseStatus);
  }

  expectDeleteError(url: string, responseStatus: number): TestRequest {
    return this.expectError('DELETE', url, undefined, responseStatus);
  }
}
