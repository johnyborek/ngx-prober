import { Directive, ElementRef, OnInit } from '@angular/core';
import { SomeService } from '../../common/sample.service';

@Directive({
  selector: '[appDirective]',
  providers: [SomeService]
})
export class SampleDirective implements OnInit {
  constructor(private el: ElementRef, private someService: SomeService) {
  }

  public ngOnInit(): void {
    this.el.nativeElement.innerHTML = this.someService.getText();
  }
}