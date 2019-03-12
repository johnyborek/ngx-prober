import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  template: '<span>{{urlParamFromSnapshot}}</span><span>{{urlParamFromObservable}}</span>'
})
export class TopComponent implements OnInit {
  urlParamFromSnapshot = '';
  urlParamFromObservable = '';

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.urlParamFromSnapshot = this.activatedRoute.snapshot.paramMap.get('myUrlParam');
    this.activatedRoute.paramMap.subscribe(val => {
      this.urlParamFromObservable = val.get('myUrlParam');
    });
  }
}