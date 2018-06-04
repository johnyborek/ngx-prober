# ngx-prober

Library for improving Unit Tests of Angular 2+ projects. Removes some boilerplate code from the tests, which makes it much more readable.

## Main features
Library contains three classes:
* ``ComponentProbe`` - template for testing Angular Components. Sets up a component and its fixture to be ready for test.
Its constructor accepts these arguments:
  * ``componentType`` - class of the component which we want to test.
  * ``modules`` - types of modules included in test fixture.
Usually it should contain at least the module where tested component is declared, so we don't need to duplicate the module dependencies in test code.
It can contain more modules if our test case requires it.
  * ``providers`` - service providers required by component under test. Allows for dynamic mock generation, or for using original implementation classes.
  * ``fixtureInit`` - code that is run before every test case, after the component creation but before running the test case.
  * ``mockedComponents`` - components which should be replaced with mocks, instead of using real implementation.
  * ``declarations`` - declarations of other components needed by our test, which are not part of any imported module.  
* ``HttpServiceProbe`` - template for testing Services, which use Angular HttpClient service. Sets up a Service and its fixture to be ready for test.
Its constructor accepts these arguments:
  * ``serviceType`` - class of the service we want to test.
  * ``providers`` - service providers required by the service under test. Allows for dynamic mock generation, or for using original implementation classes.
  * ``fixtureInit`` - code that is run before every test case, before the tested service instance is created.
  * ``modules`` - types of modules included in test fixture. HttpClientTestingModule is included automatically, so usually this field will be empty.
  * ``autoVerifyAfterEach`` - decides if HttpTestingController.verify() method should be automatically run after every test case. Defaults to true.
* ``Mock`` - support for creation of mock objects by type. 
* ``ActivatedRouteStub`` - stub for Angular ActivatedRoute, for testing controllers with URL params. 

## Installation

`npm install ngx-prober --save-dev`

## Usage

### Basic tests of ``MySampleComponent``.
``` typescript
describe('MySampleComponent', () => {
  const probe = probeComponent(MySampleComponent);
  
  it('should create', () => {
    expect(probe.component).toBeTruthy();
  });
});
```
  
Usually it's convenient to include the module which contains the component.  
Test fixture will include "declarations" and "imports" of given module then, so we don't need to duplicate them in test code.    
``` typescript
describe('MySampleComponent', () => {
  const probe = probeComponent(MySampleComponent, MySampleModule);
  
  it('should create', () => {
    expect(probe.component).toBeTruthy();
  });
});
```
  
You can also pass more component declarations:
``` typescript
describe('MySampleComponent', () => {
  const probe = probeComponent(MySampleComponent, {
    declarations: [SomeOtherComponent]
  });
  
  it('should create', () => {
    expect(probe.component).toBeTruthy();
  });
});
```


### Including more modules in test setup
``` typescript
describe('MySampleComponent', () => {
  const probe = probeComponent(MySampleComponent, MySampleModule, {
    modules: [BrowserAnimationsModule]
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

### Verifying generated HTML
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
* When using ``useValue``, remember that Angular does not inject provided object instance directly. 
* It creates the clone of the object, and injects the clone. 
* So if you need the provided object instance in your test code, you need to fetch the clone from test fixture using ``ComponentProbe.get`` (as described below).

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
* It only supports module-scoped services, and top-level component-scoped services (i.e. services in MySampleModule and MySampleComponent scope).
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
* This is done with regular Jasmine API

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
