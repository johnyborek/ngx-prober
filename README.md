# ngx-prober
![GitHub](https://img.shields.io/github/license/johnyborek/ngx-prober.svg)
![GitHub issues](https://img.shields.io/github/issues/johnyborek/ngx-prober.svg)
![npm](https://img.shields.io/npm/dt/ngx-prober.svg)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/johnyborek/ngx-prober.svg)
![npm bundle size](https://img.shields.io/bundlephobia/min/ngx-prober.svg)
![npm](https://img.shields.io/npm/v/ngx-prober.svg?color=blue)
![GitHub stars](https://img.shields.io/github/stars/johnyborek/ngx-prober.svg?style=social)

Library for improving Unit Tests of Angular 2+ projects - tested up to Angular 7. It provides the following functionality:
* Cleaner and simpler API for testing Angular projects. 
* Easy mocking of TypeScript classes.
* Simpler injection to Component and Directive scopes.
* Dynamic mocking of injected provider classes.

Using ngx-prober results in much simpler and more readable unit tests.
It removes a lot of boilerplate code and lets you concentrate on real test scenario.
 

## Installation

`npm install ngx-prober --save-dev`


## Basic example

``` typescript
describe('MySampleComponent', () => {
  const probe = probeComponent(MySampleComponent);
  
  it('should create', () => {
    expect(probe.component).toBeTruthy();
  });
});
```


## And bit more complex one...

``` typescript
describe('MySampleComponent', () => {
  const serviceMock: SomeService;

  // Second parameter of 'probeComponent' is the type of module which owns the tested component.
  // Scroll to the bottom for explanation why it's needed.
  const probe = probeComponent(MySampleComponent, ModuleOfMySampleComponent, {
    providers: [
      // This will dynamically create and inject 'SomeService' mock.
      // Real code of 'SomeService' class will not be called.
      {provide: SomeService, mock: true}
    ],
    fixtureInit: () => {
      serviceMock = probe.get(SomeService);
      
      // All functions of 'serviceMock' are Jasmine spies.
      // 'asSpy' function casts a function to 'jasmine.Spy', so you can use regular Jasmine API on returned object.  
      asSpy(serviceMock.someFunction).and.returnValue({foo: 'bar'});
    }
  });
  
  it('should call mock', () => {
    // Setting @Input value
    probe.component.someInput = 'my-value';
  
    // Listening to @Output event
    probe.component.someEvent.subscribe(() => {
      serviceMock.someFunction();
    });
    
    probe.detectChanges();
    expect(service.someFunction).toHaveBeenCalled();
  });
});
```


## API overview

### Main API
* ``probeComponent(componentType: Type<C>, componentModule: Type<any>, config: ComponentProbeConfig): ComponentProbe<C>`` - sets up a fixture for testing Component.
* ``probeHttpService(serviceType: Type<S>, config: HttpServiceProbeConfig): HttpServiceProbe<S>`` - sets up a fixture for testing service which uses HttpClient.
* ``mock(mockedType: Type<T>): T`` - creates dynamic mock object for given Type.
* ``asSpy(functionRef: Function): jasmine.Spy`` - casts a function reference to Jasmine Spy. Fails if given parameter is not a Jasmine Spy.  
* ``ActivatedRouteStub`` - simple mock for ActivatedRoute class. Code is taken from Angular documentation: https://angular.io/guide/testing.

### ComponentProbeConfig attributes
* ``providers`` - service providers required by component under test. 
 Similar to ``providers`` of ``TestBed.configureTestingModule``, but ``provider`` is extended with some new optional attributes:
  * ``mock`` - when set to true, creates dynamic mock object instead of using real class. Defaults to false.
  * ``component`` - injects the provider to given component scope, instead of module scope.
  * ``directive`` - injects the provider to given directive scope, instead of module scope.
* ``fixtureInit`` - code that is run before every test case, after the component creation but before running the test case.
* ``modules`` - additional modules which are imported to test fixture. Passed to ``imports`` of ``TestBed.configureTestingModule``.
 There's no need to import ``BrowserAnimationsModule`` or ``NoopAnimationsModule``, the latter one is added automatically.
* ``declarations`` - additional components needed by our test. Passed to ``declarations`` of ``TestBed.configureTestingModule``.
 There's no need to declare component under test, it's added automatically.
* ``detectChangesOnInit`` - runs change detection after creating test fixture. Defaults to ``true``.
* ``includeNoopAnimationModule`` - automatically imports ``NoopAnimationsModule``. Defaults to ``true``.  
* ``mockedComponents`` - component classes which should be replaced with stubs, instead of using real implementation. Experimental functionality.

### ComponentProbe attributes
* ``testBed`` - Angular TestBed.
* ``fixture`` - Angular test component fixture.
* ``component`` - instance of component under test.
* ``nativeElement`` - HTML element for component under test.
* ``debugElement`` - debug element for component under test.
* ``get(type): T`` - retrieves service from root Angular scope (similar to ``TestBed.get``).
* ``getFromChildComponent(type, childComponentType): T`` - retrieves service from component scope.
* ``getFromDirective(type, directiveType): T`` - retrieves service from directive scope.
* ``detectChanges()`` - runs change detection.
* ``queryByCss(selector): DebugElement`` - returns first element matching given css selector 
* ``queryAllByCss(selector): DebugElement[]`` - returns all elements matching given css selector

### HttpServiceProbeConfig attributes
* ``providers`` - service providers required by the service under test.
* ``fixtureInit`` - code that is run before every test case, before the tested service instance is created.
* ``modules`` - additional modules which are imported to test fixture. ``HttpClientTestingModule`` is included automatically, no need to add it here.
* ``autoVerifyAfterEach`` - decides if ``HttpTestingController.verify()`` method should be called automatically after every test case. Defaults to true.

### HttpServiceProbe attributes
* ``testBed`` - Angular TestBed.
* ``service`` - instance of service under test.
* ``httpController`` - ``HttpTestingController`` instance
* ``get(type): T`` - retrieves service from root Angular scope (similar to ``TestBed.get``).
* ``expect(...): TestRequest`` - base function for defining expected HTTP call, and replying to it with given content.
 Flexible but verbose, consider using other functions instead. 
* ``expectSuccess(...): TestRequest`` - base function for defining expected HTTP call, and replying with success.
 Consider using dedicated functions for HTTP methods, before using this one. 
* ``expectGet(...): TestRequest`` - function for defining expected GET call, and replying with success. 
* ``expectPost(...): TestRequest`` - similar to above
* ``expectPut(...): TestRequest`` - similar to above
* ``expectDelete(...): TestRequest`` - similar to above
* ``expectError(...): TestRequest`` - base function for defining expected HTTP call, and replying with error.
 Consider using dedicated functions for HTTP methods, before using this one. 
* ``expectGetError(...): TestRequest`` - function for defining expected GET call, and replying with error. 
* ``expectPostError(...): TestRequest`` - similar to above
* ``expectPutError(...): TestRequest`` - similar to above
* ``expectDeleteError(...): TestRequest`` - similar to above


## Detailed examples

### Basics test setup
``` typescript
describe('MySampleComponent', () => {
  const probe = probeComponent(MySampleComponent, MySampleModule);
  
  it('should create', () => {
    expect(probe.component).toBeTruthy();
  });
});
```
``MySampleModule`` is the module that owns ``MySampleComponent``.
Test fixture will include ``declarations``, ``imports``  and ``providers`` of ``MySampleModule``, so we don't need to duplicate them in test code.
We can later mock the things we don't need.    
  
### Including additional modules and components in test setup
``` typescript
describe('MySampleComponent', () => {
  const probe = probeComponent(MySampleComponent, MySampleModule, {
    declarations: [SomeOtherComponent],
    modules: [BrowserAnimationsModule, SomeOtherModule],
    includeNoopAnimationModule: false
  });
  
  it('should create', () => {
    expect(probe.component).toBeTruthy();
  });
});
```

### Binding to component @Input and @Output fields
``` typescript
describe('MySampleComponent', () => {
  const probe = probeComponent(MySampleComponent, MySampleModule);
  
  it('should bind', () => {
    // Setting @Input value
    probe.component.someInput = 'my-value';
  
    // Listening to @Output event
    probe.component.someEvent.subscribe(() => {/* My test listener here */});
    
    probe.detectChanges();
  });
});
```

### Verifying generated HTML content
``` typescript
describe('MySampleComponent', () => {
  const probe = probeComponent(MySampleComponent, MySampleModule);
  
  it('should contain stuff', () => {
  
    // Checking whether HTML contains given text
    expect(probe.nativeElement.innerHTML.indexOf('My text')).not.toEqual(-1);
  
    // Checking whether HTML contains given tag(s)
    expect(probe.queryAllByCss('img').length).toEqual(2);
  
    // Checking whether HTML tag's attribute has correct value
    expect(probe.queryByCss('img').properties['src']).toEqual('my-awesome-image.png');
  
    // 'nativeElement' can be used on entries returnedy by 'queryByCss'
    expect(probe.queryByCss('span').nativeElement.innerHTML).toEqual('My text');
  });
});
```

### Handling providers
``` typescript
describe('MySampleComponent', () => {
  
  // Injecting real implementation of SomeService:
  const probe = probeComponent(MySampleComponent, MySampleModule, {
    providers: [
      SomeService
    ]
  });
  
  // Creating and injecting mock of SomeService:
  const probe = probeComponent(MySampleComponent, MySampleModule, {
    providers: [
      {provide: SomeService, mock: true}
    ]
  });
  
  // You can still use standard Angular way:
  const probe = probeComponent(MySampleComponent, MySampleModule, {
    providers: [
      {provide: SomeService, useClass: SomeServiceStub},
      {provide: AnotherService, useValue: {foo: 'bar'}}
    ]
  });
  
  it(/* some tests here */);
});
```

Remarks:
* Angular always clones the object passed in ``useValue``, original instance is not used. 
* If you need that object later, don't use the original one from ``useValue``. You need to fetch the cloned one, 
 using ``probe.get(...)`` (as described below).

### Handling component-scoped and directive-scoped providers
``` typescript
describe('MySampleComponent', () => {
  const probe = probeComponent(MySampleComponent, MySampleModule, {
    providers: [
      {provide: SomeService, component: SomeComponent, mock: true},
      {provide: SomeService, directive: SomeDirective, useValue: SomeServiceStub}
    ]
  });
});
```

Remarks:
* You can use ``mock``, ``useClass`` or ``useValue``, as in previous example.
* Just add ``component`` or ``directive`` attribute, to put the service in Component or Directive scope, instead of Module scope. 

### Retrieving service instances (or serivce mock instances)
``` typescript
describe('MySampleComponent', () => {
  const probe = probeComponent(MySampleComponent, MySampleModule, {
    providers: [
      {provide: SomeService, mock: true}
    ]
  });
  
  it('should mock the service', () => {
    const service: SomeService = probe.get(SomeService);
    expect(service).toBeTruthy();
  });
});
```

Remarks:
* ``probe.get(...)`` only retrieves module-scoped services, and top-level component-scoped services (i.e. services in MySampleModule and MySampleComponent scope).
* Next section describes how to fetch directive-scoped services and nested child-scoped services. 

### Retrieving component-scoped service instances from child components, and directive-scoped service instances
``` typescript
describe('MySampleComponent', () => {
  const probe = probeComponent(MySampleComponent, MySampleModule, {
    providers: [
      {provide: ComponentScopedService, component: SomeChildComponent, mock: true},
      {provide: DirectiveScopedService, directive: SomeDirective, mock: true}
    ]
  });

  it('', () => {
     const componentService = probe.getFromChildComponent(ComponentScopedService, SomeChildComponent);
     const directiveService = probe.getFromDirective(DirectiveScopedService, SomeDirective);
  });
});
```

Remarks:
* Service only exists, if given component/directive also exists on the page.
* So ``getFrom...`` will fail if component/directive was not rendered for some reason (e.g. by false *ngIf condition, which removed some content).

### Creating Mocks outside of ComponentProbe
``` typescript
it('should create mock', () => {
  const dialogMock: MatDialogRef = mock(MatDialogRef);
}
```

Remarks:
* Created mock is identical to the one created with ``{provide: ..., mock: true}``.
* Mock can be created this way only inside ``it`` or ``beforeEach`` functions. ``mock`` call will fail when used outside of these functions.
* So ``mock`` is not suitable for ``providers`` section. This code will fail:  
   ``{provide: SomeService, useValue: mock(SomeService)}``  
 Use this sytax for creating mocks in ``providers`` section:  
   ``{provide: SomeService, mock: true}``

### Instrumenting Mock functions
``` typescript
describe('MySampleComponent', () => {
  const probe = probeComponent(MySampleComponent, MySampleModule, {
    providers: [
      {provide: SomeService, mock: true}
    ],
    fixtureInit: () => {
      const service = probe.get(SomeService);
      asSpy(service.someFunction).and.returnValue({foo: 'bar'});
    }
  });
  
  it('should call mock', () => {
    const service: SomeService = probe.get(SomeService);
    service.someFunction();
    expect(service.someFunction).toHaveBeenCalled();
  });
});
```

Remarks:
* Function spies are implemented with Jasmine, so we can use full Jasmine API after calling ``asSpy``.

### Instrumenting real object's funcions
``` typescript
describe('MySampleComponent', () => {
  const probe = probeComponent(MySampleComponent, MySampleModule, {
    fixtureInit: () => {
      // This will replace original ``open`` function with stub.
      spyOn(window, 'open');
    }
  });

  it('should call mock', () => {
    // Window will not be opened, just the stub will be called.
    window.open();
    expect(window.open).toHaveBeenCalled();
  });
});
```

Remarks:
* This is done with regular Jasmine API.

### Mocking child components
``` typescript
describe('Component mocks', () => {
  const probe = probeComponent(MySampleComponent, MySampleModule, {
    provide: [
      // You need to mock all services used by child components you want to mock.
      {provide: SomeService, mock: true}
    ],
    mockedComponents: [
      // Specify the list of child components you want to mock 
      ChildComponent
    ]
  });
});
```

Remarks:
* It would be better, if services used by component would be automatically mocked, without specifying it in ``providers``. Just I don't know how to implement it.

### Simulating UI interactions
``` typescript
describe('MySampleComponent', () => {
  const probe = probeComponent(MySampleComponent, MySampleModule, {
    fixtureInit: () => {
      spyOn(window, 'open');
    }
  });
  
  // Let's assume that component has a <button> with (click)="window.open('https://my-url.com')"
  it('clicking button should trigger window.open', () => {
    const button = probe.queryByCss('button');
    button.triggerEventHandler('click', null);
  
    expect(window.open).toHaveBeenCalledTimes(1);
    expect(asSpy(window.open).calls.first().args[0]).toEqual('https://my-url.com');
  });
});
```

### Testing components which use Router
``` typescript
describe('MySampleComponent', () => {
  const probe = probeComponent(MySampleComponent, MySampleModule, {
    providers: [
      {provide: Router, mock: true}
    ]
  });
  
  it('should navigate', () => {
    probe.queryByCss('button').triggerEventHandler('click', null);
    probe.detectChanges();
  
    const router = probe.get(Router);
    expect(router.navigate).toHaveBeenCalledWith(['/my-sample-url']);
  });
});
```

### Testing components which use URL parameters
``` typescript
describe('MySampleComponent', () => {
  // Let's assume that component requires URL parameter, like '/my-sample-component/:myParamName
  
  const probe = probeComponent(MySampleComponent, MySampleModule, {
    providers: [
      {provide: ActivatedRoute, useClass: ActivatedRouteStub}
    ],
    fixtureInit: () => {
      const activatedRouteStub: ActivatedRouteStub = <any>probe.get(ActivatedRoute);
      activatedRouteStub.testParamMap = {myParamName: 'my-param-value'};
    }
  });
  
  it('should create', () => {
    expect(probe.component).toBeTruthy();
  });
});
```

### Testing MatDialogs components
``` typescript
describe('MyDialogComponent', () => {

  const probe = componentProbe(MyDialogComponent, MyDialogModule, {
    providers: [
      {provide: MatDialogRef, mock: true},
      {provide: MAT_DIALOG_DATA, useValue: {}}
    ]
  });

  it('should return dialog result', () => {
    // Fill in the component's FormGroups
    probe.component.formGroup.get('field-name').setValue('some-val');
    // ...

    // Trigger the submit
    probe.component.someFunctionThatSubmits();

    // Test the result
    expect(probe.get(MatDialogRef).close).toHaveBeenCalledWith(/* Expected dialog result here */{});
  });
});
```

### Testing components which use MatDialogs
``` typescript
describe('MySampleComponent', () => {
  const probe = probeComponent(MySampleComponent, MySampleModule);
  
  it('should handle the response from MatDialog', () => {
    // Initialize Dialog Mock
    const mockedDialogResult = {foo: 'bar'};
    const dialogMock: MatDialogRef<MyDialogComponent> = <any>mock(MatDialogRef);
    asSpy(dialogMock.afterClosed).and.returnValue(Observable.of(mockedDialogResult));
    spyOn(probe.get(MatDialog), 'open').and.returnValue(dialogMock);
  
    // Trigger displaying Dialog, which instantly returns response from Dialog Mock
    probe.queryByCss('button').triggerEventHandler('click', null);
    probe.detectChanges();
  
    // Verify the result
    expect(probe.get(MatDialog).open).toHaveBeenCalled();
    expect(dialogMock.afterClosed).toHaveBeenCalled();
    expect(probe.component /*...*/); // Verify how given Dialog result affected the component state
  });
});
```

### Testing services which use HttpClient
``` typescript
describe('MyService', () => {
  const probe = probeHttpService(MyService, {
    providers: [
      {provide: ConfigService, mock: true}
    ],
    fixtureInit: () => {
      asSpy(probe.get(ConfigService).getSettings).and.returnValue('https://my.endpoint.url');
    }
  });

  it('should do some http calls', () => {
    probe.service.someFunctionCallingBackend().subscribe(
      (result) => {
        expect(result).toEqual({/* Examine function output */});
      }
    );

    // Define expected backend calls
    probe.expectGet('https://my.endpoint.url/my-path', {/* Response that will be returned by http mock */});
    probe.expectPost('https://my.endpoint.url/my-path', {/* Expected request body */});
  });
});
```

### Simulating HTTP errors
``` typescript
describe('MyService', () => {
  const probe = probeHttpService(MyService, {
    providers: [
      {provide: ConfigService, mock: true}
    ],
    fixtureInit: () => {
      asSpy(probe.get(ConfigService).getSettings).and.returnValue('https://my.endpoint.url');
    }
  });

  it('should handle http error', () => {
    probe.service.someFunctionCallingBackend().subscribe(
      (result) => {
        expect(result).toEqual({/* Examine function output on error */});
      }
    );

    // Define expected backend calls, and simulated error response
    probe.expectGetError( 'https://my.endpoint.url/my-path', 500);
  });
});
```

### Verifying whether given url was NOT called
``` typescript
describe('MyService', () => {
  const probe = probeHttpService(MyService, {
    providers: [
      {provide: ConfigService, mock: true}
    ],
    fixtureInit: () => {
      asSpy(probe.get(ConfigService).getSettings).and.returnValue('https://my.endpoint.url');
    }
  });

  it('should not call PUT', () => {
    probe.service.someFunctionCallingBackend().subscribe(/* ... */);

    probe.httpController.expectNone( {method: 'PUT', url: 'https://my.endpoint.url'});
  });
});
```

### Calling real HTTP backend from test case
``` typescript
describe('MyService', () => {
  const probe = probeHttpService(MyService, {
    providers: [
      {provide: ConfigService, mock: true}
    ],
    fixtureInit: () => {
      asSpy(probe.get(ConfigService).getSettings).and.returnValue('https://my.endpoint.url');
    },
    modules: [
      HttpClientModule
    ]
  });

  it('should call real backend', () => {
    probe.service.someFunctionCallingBackend().subscribe(/* ... */);
  });
});
``` 

Remarks:
* It's enough to add HttpClientModule in HttpServiceProbeConfig.modules field.
* You cannot use any HttpServiceProbe.expect... functions. They will fail,
as HttpTestingController is not defined when using HttpClientModule instead of HttpClientTestingModule.


### Testing services which don't use HttpClient
``` typescript
describe('MySampleService', () => {
  let myService: MySampleService;
  beforeEach(() => {
    const dependencyMock = mock(SomeDependantService);
    myService = new MySampleService(dependencyMock);
  });
  
  it('should work', () => {
    expect(myService /*...*/); // Verify service behavior
  });
});
```

Remarks:
* Services should be tested with plain tests, without using Angular TestBed. Testing them within Angular container is just unnecessary complication.
* ``mock`` still can be used for mocking service's dependencies.
* Or we can use more comprehensive mocking frameworks instead, like ts-mockito or typemoq.

## Limitations
* Mocking mechanism does not support interface types. Only class types can be mocked.
* Jasmine functionality ``mock.someFuntction.and.callThrough`` does not work for mocks generated by class type. Original object is not created when generating mock, so there's no instance which could handle ``callThrough`` behavior.


## Why to import module which owns the component, into the test fixture?

``` typescript
  // Second parameter of 'probeComponent' is the type of module which owns the tested component.
  const probe = probeComponent(MySampleComponent, ModuleOfMySampleComponent, { ... });
```

Here's the promised explanation :)  
The module declaration contains dependencies of tested component. Usually we need some of these dependencies in test fixture as well.
The most popular solution is to declare these dependencies twice:
* in declaration of module which owns the component (for production use)
* in test fixture setup (for unit tests)

I don't like duplication, so I'm using another approach:
* import a module which owns the component into the test fixture
* mock the module dependencies which you don't need

From my experience, it makes the code for test initialization much shorter and easier to maintain. 
That's why ``probeComponent`` function encourages you to pass the component's module as second parameter.
If you don't like it, just pass ``undefined`` and do the duplication :)
