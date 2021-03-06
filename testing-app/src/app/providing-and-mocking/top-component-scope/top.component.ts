import { Component } from '@angular/core';
import { SomeService } from '../../common/sample.service';

@Component({
  template: '<h1>{{someService.getText()}}</h1>',
  providers: [SomeService]
})
export class TopComponent {
  constructor(public someService: SomeService) {
  }
}