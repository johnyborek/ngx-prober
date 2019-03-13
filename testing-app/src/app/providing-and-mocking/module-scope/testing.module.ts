import { NgModule } from '@angular/core';
import { SomeService } from '../../common/sample.service';
import { TopComponent } from './top.component';

@NgModule({
  declarations: [
    TopComponent,
  ],
  exports: [TopComponent],
  providers: [SomeService]
})
export class TestingModule {}