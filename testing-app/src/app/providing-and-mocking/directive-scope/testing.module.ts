import { NgModule } from '@angular/core';
import { SampleDirective } from './sample.directive';
import { TopComponent } from './top.component';

@NgModule({
  declarations: [
    TopComponent,
    SampleDirective
  ],
  exports: [TopComponent, SampleDirective]
})
export class TestingModule {}