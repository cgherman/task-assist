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
  public warningMessage = null;

  constructor(private crossComponentEventService: CrossComponentEventService) {
  }
  
  ngOnInit() {
    var sub = this.crossComponentEventService.requestTitleChange.subscribe(text => this.onRequestTitleChange(text));
    this.subscriptions.push(sub); // capture for destruction

    var sub = this.crossComponentEventService.requestWarningMessageAppend.subscribe(text => this.onRequestWarningMessageAppend(text));
    this.subscriptions.push(sub); // capture for destruction

    var sub = this.crossComponentEventService.requestWarningMessageClear.subscribe(item => this.onRequestWarningMessageClear());
    this.subscriptions.push(sub); // capture for destruction
  }

  // ngOnDestroy needs to be present for @AutoUnsubscribe to function
  ngOnDestroy() {
  }

  private onRequestTitleChange(text: string) {
    this.title = text;
  }

  private onRequestWarningMessageAppend(text: string) {
    console.log("Warning: " + text);
    this.warningMessage = this.warningMessage == null ? text : this.warningMessage + " " + text;
  }

  private onRequestWarningMessageClear() {
    console.log("Warnings cleared.");
    this.warningMessage = null;
  }

}