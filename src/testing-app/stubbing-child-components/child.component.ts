import { Component } from '@angular/core';
import { SomeService } from '../common/sample.service';

@Component({
  selector: 'app-child-component',
  template: '<p>{{someService.getText()}}</p>',
  providers: [SomeService]
})
export class ChildComponent {
  constructor(public someService: SomeService) {
  }
}