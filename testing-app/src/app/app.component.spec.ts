import { async } from '@angular/core/testing';
import { probeComponent } from '../../../src/index';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

describe('AppComponent', () => {
  const probe = probeComponent(AppComponent, AppModule);

  it('should create the app', async(() => {
    expect(probe.component).toBeTruthy();
  }));
});
