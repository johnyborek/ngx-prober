import { NgModule } from '@angular/core';
import { TopComponent } from './top.component';

@NgModule({
  declarations: [
    TopComponent,
  ],
  exports: [TopComponent],
})
export class TestingModule {}