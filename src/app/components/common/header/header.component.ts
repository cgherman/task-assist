import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

import { MSG_TITLE_DEFAULT } from '../../../user-messages';
import { CrossComponentEventService } from '../../../services/shared/cross-component-event.service';

@AutoUnsubscribe({includeArrays: true})
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];

  public title = MSG_TITLE_DEFAULT;
  public headerMessage = null;

  constructor(private crossComponentEventService: CrossComponentEventService) {
  }
  
  ngOnInit() {
    var sub = this.crossComponentEventService.requestTitleChange.subscribe(item => this.onRequestTitleChange(item));
    this.subscriptions.push(sub); // capture for destruction

    var sub = this.crossComponentEventService.requestHeaderMessageAppend.subscribe(item => this.onRequestHeaderMessageAppend(item));
    this.subscriptions.push(sub); // capture for destruction
  }

  // ngOnDestroy needs to be present for @AutoUnsubscribe to function
  ngOnDestroy() {
  }

  // $event: string
  private onRequestTitleChange($event) {
    this.titleChange($event);
  }
  
  private titleChange(text: string) {
    this.title = text;
  }
  // $event: string
  private onRequestHeaderMessageAppend($event) {
    this.headerMessageAppend($event);
  }
  
  private headerMessageAppend(text: string) {
    console.log("Message: " + text);
    this.headerMessage = this.headerMessage == null ? text : this.headerMessage + " " + text;
  }

}