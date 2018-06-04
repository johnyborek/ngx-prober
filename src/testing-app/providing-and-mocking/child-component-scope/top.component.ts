import { Component } from '@angular/core';

@Component({
  template: '<h1><app-child-component></app-child-component></h1><app-child-component></app-child-component>' +
  '<div><span><app-child-component></app-child-component></span></div>'
})
export class TopComponent {
  constructor() {
  }
}