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
    var sub = this.crossComponentEventService.requestTitleChange.subscribe(text => this.onRequestTitleChange(text));
    this.subscriptions.push(sub); // capture for destruction

    var sub = this.crossComponentEventService.requestHeaderMessageAppend.subscribe(text => this.onRequestHeaderMessageAppend(text));
    this.subscriptions.push(sub); // capture for destruction
  }

  // ngOnDestroy needs to be present for @AutoUnsubscribe to function
  ngOnDestroy() {
  }

  private onRequestTitleChange(text: string) {
    this.title = text;
  }

  private onRequestHeaderMessageAppend(text: string) {
    console.log("Message: " + text);
    this.headerMessage = this.headerMessage == null ? text : this.headerMessage + " " + text;
  }

}