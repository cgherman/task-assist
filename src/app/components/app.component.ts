import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

import { MSG_GOOGLE_LOAD_FAILURE, MSG_TITLE_DEFAULT } from './user-messages';
import { AuthServiceBase } from '../services/auth/auth-service-base';

@AutoUnsubscribe({includeArrays: true})
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('googleLogin') googleLogin: ElementRef;
  @ViewChild('googleTriggerRender') googleTriggerRender: ElementRef;
  @ViewChild('googleExternalEventsCompleted') googleExternalEventsCompleted: ElementRef;

  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];

  public title = MSG_TITLE_DEFAULT;
  public headerMessage = null;

  constructor(private authService: AuthServiceBase,
              private router: Router) {

    // Wire up GAPI Auth actions
    const _self = this;
    window['onGapiLoadError'] = function () {
      _self.onGapiLoadError();
    };
  }

  onGapiLoadError() {
    console.log("Google Auth Failed to Load!");
    this.headerMessageAppend(MSG_GOOGLE_LOAD_FAILURE);
    this.backgroundGoogleTasksDone();
  }

  headerMessageAppend(text: string) {
    console.log("Message: " + text);
    this.headerMessage = this.headerMessage == null ? text : this.headerMessage + " " + text;
  }
  
  ngOnInit() {
  }

  // ngOnDestroy needs to be present for @AutoUnsubscribe to function
  ngOnDestroy() {
  }

  ngAfterViewInit(): void {
  }

  // Fired when config is loaded, including required meta keys
  public configIsResolved() {
    // Activate Google OAuth2 login control
    this.googleTriggerRender.nativeElement.click();
  }
  
  public backgroundGoogleTasksDone() {
    // Trigger UI update, notifying Angular of GAPI-induced model changes.
    // Pollin GAPI for completion does work, but this is preferable.
    // Note: Built-in method markForCheck() has not been effective at this stage
    this.googleExternalEventsCompleted.nativeElement.click();
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