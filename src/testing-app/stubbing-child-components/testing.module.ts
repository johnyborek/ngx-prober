import { NgModule } from '@angular/core';
import { ChildComponent } from './child.component';
import { TopComponent } from './top.component';

@NgModule({
  declarations: [
    TopComponent, ChildComponent
  ],
  exports: [TopComponent, ChildComponent]
})
export class TestingModule {}