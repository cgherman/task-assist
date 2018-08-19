import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthServiceBase } from '../../../services/auth/auth-service-base';
import { Subscription } from 'rxjs';

import { MSG_GOOGLE_LOAD_FAILURE } from '../../../user-messages';
import { CrossComponentEventService } from '../../../services/shared/cross-component-event.service';

@Component({
  selector: 'app-auth-controls',
  templateUrl: './auth-controls.component.html',
  styleUrls: ['./auth-controls.component.css']
})
export class AuthControlsComponent implements OnInit {
  @ViewChild('googleLogin') googleLogin: ElementRef;
  @ViewChild('googleTriggerRender') googleTriggerRender: ElementRef;
  @ViewChild('googleExternalEventsCompleted') googleExternalEventsCompleted: ElementRef;

  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];

  constructor(private authService: AuthServiceBase,
              private crossComponentEventService: CrossComponentEventService) {
                
    // Wire up GAPI Auth actions
    const _self = this;
    window['onGapiLoadError'] = function () {
      _self.onGapiLoadError();
    };
  }

  onGapiLoadError() {
    console.log("Google Auth Failed to Load!");
    this.crossComponentEventService.signalHeaderMessageAppend(MSG_GOOGLE_LOAD_FAILURE);
    this.onBackgroundGoogleTasksDone();
  }

  ngOnInit() {
    var sub = this.crossComponentEventService.configResolved.subscribe(item => this.onConfigResolved());
    this.subscriptions.push(sub); // capture for destruction

    var sub = this.crossComponentEventService.backgroundGoogleTasksDone.subscribe(item => this.onBackgroundGoogleTasksDone());
    this.subscriptions.push(sub); // capture for destruction
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
  // Triggered by googleExternalEventsCompleted event
  onGoogleExternalEventsCompleted() {
    // TODO: Handle any necessary user dialog here
  }
  
  isSignedIn(): boolean {
    return this.authService.isAuthenticated();
  }
}
