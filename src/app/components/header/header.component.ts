import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

import { MSG_GOOGLE_LOAD_FAILURE, MSG_TITLE_DEFAULT } from '../user-messages';
import { AppComponent } from '../app.component';
import { AuthServiceBase } from '../../services/auth/auth-service-base';
import { AppEventsService } from '../../services/app-events.service';

@AutoUnsubscribe({includeArrays: true})
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('googleLogin') googleLogin: ElementRef;
  @ViewChild('googleTriggerRender') googleTriggerRender: ElementRef;
  @ViewChild('googleExternalEventsCompleted') googleExternalEventsCompleted: ElementRef;

  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];

  public title = MSG_TITLE_DEFAULT;
  public headerMessage = null;

  constructor(private authService: AuthServiceBase,
              private appComponent: AppComponent,
              private router: Router,
              private appEventsService: AppEventsService) {

    // Wire up GAPI Auth actions
    const _self = this;
    window['onGapiLoadError'] = function () {
      _self.onGapiLoadError();
    };
  }

  onGapiLoadError() {
    console.log("Google Auth Failed to Load!");
    this.headerMessageAppend(MSG_GOOGLE_LOAD_FAILURE);
    this.onBackgroundGoogleTasksDone();
  }
  
  ngOnInit() {
    var sub = this.appEventsService.configResolved.subscribe(item => this.onConfigResolved());
    this.subscriptions.push(sub); // capture for destruction

    var sub = this.appEventsService.backgroundGoogleTasksDone.subscribe(item => this.onBackgroundGoogleTasksDone());
    this.subscriptions.push(sub); // capture for destruction

    var sub = this.appEventsService.requestTitleChange.subscribe(item => this.onRequestTitleChange(item));
    this.subscriptions.push(sub); // capture for destruction

    var sub = this.appEventsService.requestHeaderMessageAppend.subscribe(item => this.onRequestHeaderMessageAppend(item));
    this.subscriptions.push(sub); // capture for destruction
  }

  // ngOnDestroy needs to be present for @AutoUnsubscribe to function
  ngOnDestroy() {
  }

  private onConfigResolved() {
    // Activate Google OAuth2 login control
    this.googleTriggerRender.nativeElement.click();
  }

  private onBackgroundGoogleTasksDone() {
    // Trigger UI update, notifying Angular of GAPI-induced model changes.
    // Polling GAPI for completion does work, but this is preferable currently.
    this.googleExternalEventsCompleted.nativeElement.click();
  }

  // $event: string
  private onRequestTitleChange($event) {
    this.title = $event;
  }

  // $event: string
  private onRequestHeaderMessageAppend($event) {
    this.headerMessageAppend($event);
  }
  
  headerMessageAppend(text: string) {
    console.log("Message: " + text);
    this.headerMessage = this.headerMessage == null ? text : this.headerMessage + " " + text;
  }


  // Triggered by googleExternalEventsCompleted event
  onGoogleExternalEventsCompleted() {
    // TODO: Handle any necessary user dialog here
  }
  
  isSignedIn(): boolean {    
    return this.authService.isAuthenticated();
  }

  currentView(): string {
    if (this.router.url.indexOf('quadrant') > 0) {
      return "Quad";
    }
    if (this.router.url.indexOf('vertical-list') > 0) {
      return "Vert";
    }
    return "";
  }

  switchView() {
    var currentView = this.currentView();
    if (currentView == "Quad") {
      // We're on quadrant, switch to vertical-list
      window.location.assign("/vertical-list");
    }
    if (currentView == "Vert") {
      // We're on quadrant, switch to vertical-list
      window.location.assign("/quadrant");
    }
  }
}