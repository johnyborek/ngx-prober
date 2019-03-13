import { DebugElement, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { mock } from '../..';
import { ComponentProbeConfig } from './component.probe.config';

class ComponentProbeInitializer<C> {
  private testBed: typeof TestBed;
  private componentProviders: Map<Type<any>, any[]> = new Map();
  private directiveProviders: Map<Type<any>, any[]> = new Map();

  constructor(
    private componentType: Type<C>,
    private componentModule: Type<any>,
    private config: ComponentProbeConfig,
  ) {}

  public initAsync(): typeof TestBed {
    this.createProviderMocks();
    this.extractScopedProviders('component', this.componentProviders);
    this.extractScopedProviders('directive', this.directiveProviders);
    this.addDefaultComponentsAndModules();
    this.configureTestingModule();
    this.testBed.compileComponents();
    return this.testBed;
  }

  private createProviderMocks(): void {
    this.config.providers.forEach(provider => {
      if (provider.mock === true) {
        provider.useValue = mock(provider.provide);
      }
    });
  }

  private extractScopedProviders(providerScopeType: string, targetProviderMap: Map<any, any[]>): void {
    this.config.providers = this.config.providers.filter(provider => {
      if (provider[providerScopeType]) {
        if (!targetProviderMap.get(provider[providerScopeType])) {
          targetProviderMap.set(provider[providerScopeType], []);
        }
        targetProviderMap.get(provider[providerScopeType]).push(provider);
        return false;
      }
      return true;
    });
  }

  private addDefaultComponentsAndModules(): void {
    if (this.componentModule) {
      this.config.modules.push(this.componentModule);
    }
    if (this.config.includeNoopAnimationModule) {
      this.config.modules.push(NoopAnimationsModule);
    }
    if (!this.componentModule && this.config.declarations.indexOf(this.componentType) === -1) {
      this.config.declarations.push(this.componentType);
    }
  }

  private configureTestingModule(): void {
    this.testBed = TestBed.configureTestingModule({
      imports: this.config.modules as any,
      providers: this.config.providers,
      declarations: this.config.declarations,
    });
    this.addComponentProviders();
    this.addDirectiveProviders();
    this.mockComponents(this.config.mockedComponents);
  }

  private addComponentProviders(): void {
    this.componentProviders.forEach((providers, componentType) => {
      this.testBed.overrideComponent(componentType, {
        set: {
          providers,
        },
      });
    });
  }

  private addDirectiveProviders(): void {
    this.directiveProviders.forEach((providers, directiveType) => {
      this.testBed.overrideDirective(directiveType, {
        set: {
          providers,
        },
      });
    });
  }

  private mockComponents(types: Array<Type<any>>): void {
    types.forEach(type => {
      this.testBed.overrideTemplate(type, '<span>mock of ' + type.name);
    });
  }
}

export class ComponentProbe<C> {
  public testBed: typeof TestBed;
  public fixture: ComponentFixture<C>;
  public component: C;
  public nativeElement: HTMLElement;
  public debugElement: DebugElement;

  constructor(
    private componentType: Type<C>,
    private componentModule: Type<any>,
    private config?: ComponentProbeConfig,
  ) {
    beforeEach(async(() => {
      this.testBed = new ComponentProbeInitializer(this.componentType, this.componentModule, this.config).initAsync();
    }));
    beforeEach(() => this.init());
  }

  private init(): void {
    this.fixture = TestBed.createComponent(this.componentType);
    this.component = this.fixture.componentInstance;
    this.nativeElement = this.fixture.nativeElement;
    this.debugElement = this.fixture.debugElement;
    this.config.fixtureInit();
    if (this.config.detectChangesOnInit) {
      this.fixture.detectChanges();
    }
  }

  public get<T>(type: Type<T>): T {
    if (this.debugElement) {
      return this.debugElement.injector.get(type);
    }
    return this.testBed.get(type);
  }

  public getFromChildComponent<T>(type: Type<T>, childComponentType: Type<any>): T {
    const debugElements = this.debugElement
      .queryAll(By.all())
      .filter(e => e.componentInstance instanceof childComponentType);

    if (debugElements.length > 0) {
      // There can be more than one component instance on the page, but all share the same 'provided' services.
      return debugElements[0].injector.get(type);
    }
    throw new Error('No component instance exists for type ' + childComponentType.name);
  }

  public getFromDirective<T>(type: Type<T>, directiveType: Type<any>): T {
    const debugElements = this.debugElement.queryAll(By.directive(directiveType));

    if (debugElements.length > 0) {
      // There can be more than one directive instance on the page, but all share the same 'provided' services.
      return debugElements[0].injector.get(type);
    }
    throw new Error('No directive instance exists for type ' + directiveType.name);
  }

  public detectChanges(): void {
    this.fixture.detectChanges();
  }

  public queryByCss(css: string): DebugElement {
    return this.debugElement.query(By.css(css));
  }

  public queryAllByCss(css: string): DebugElement[] {
    return this.debugElement.queryAll(By.css(css));
  }
}
