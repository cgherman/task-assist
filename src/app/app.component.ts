import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { Subscription } from 'rxjs';
import { AuthServiceBase } from './auth-service-base';

@AutoUnsubscribe({includeArrays: true})
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  
  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];

  constructor(private authService: AuthServiceBase) {
  }

  ngOnInit() {
  }

  // ngOnDestroy needs to be present for @AutoUnsubscribe to function
  ngOnDestroy() {
  }

  ngAfterViewInit(): void {
  }

  
}