import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Meta } from '@angular/platform-browser';

import { MSG_GOOGLE_LOAD_FAILURE } from '../../../user-messages';
import { CrossComponentEventService } from '../../../services/shared/cross-component-event.service';
import { GoogleAuthServiceBase } from '../../../services/auth/google-auth-service-base';

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

  constructor(private authService: GoogleAuthServiceBase,
              private crossComponentEventService: CrossComponentEventService
            ) {
                
    // Wire up Google Auth actions
    const _self = this;
    window['onGapiLoadError'] = function () {
      _self.onGapiLoadError();
    };
    window['onSignIn'] = function (googleUser) {
      _self.onSignIn(googleUser);
    };
    window['onSignOut'] = function () {
      _self.onSignOut();
    };
  }

  ngOnInit() {
    // intercept config completion
    var sub = this.crossComponentEventService.configLoaded.subscribe(item => this.onConfigLoaded());
    this.subscriptions.push(sub); // capture for destruction
    
    // intercept auth success
    var sub = this.authService.authenticated.subscribe(item => this.onAuthenticated());
    this.subscriptions.push(sub); // capture for destruction

    // intercept auth failure
    sub = this.authService.failedToLoadAuth.subscribe(item => this.onFailedToLoadAuth());
    this.subscriptions.push(sub); // capture for destruction
    
    // intercept google data load completion
    var sub = this.crossComponentEventService.dataLoadComplete.subscribe(item => this.onDataLoadComplete());
    this.subscriptions.push(sub); // capture for destruction
  }

  isSignedIn(): boolean {
    return this.authService.isAuthenticated();
  }
  
  // Called when it's okay to render the Google Sign-in button
  private onConfigLoaded() {
    // Activate Google OAuth2 login control
    this.googleTriggerRender.nativeElement.click();
  }

  // May occur if render fails
  onGapiLoadError() {
    console.log("Google Auth Failed to Load!");
    this.crossComponentEventService.signalHeaderMessageAppend(MSG_GOOGLE_LOAD_FAILURE);
    this.onDataLoadComplete();
  }

  // Triggered by Google login button
  public onSignIn(googleUser) {
    this.signIn();
  }

  // Triggered by user clicking the form button
  public onSignOut() {
    this.authService.signOut();
  }

  // begin the sign-in/authorization process
  private signIn() {
    // sign in using authorization service
    this.authService.signIn();
  }
  
  // Triggered by authorization service
  public onAuthenticated() {
    // fire event indicating GAPI services are initialized
    console.log("GAPI client initialized.  Ready for data load.");
    this.crossComponentEventService.signalDataReadyToLoad();
  }

  // Triggered by authorization service
  public onFailedToLoadAuth() {
    console.log("Google Auth Failed to Load!");
    this.crossComponentEventService.signalHeaderMessageAppend(MSG_GOOGLE_LOAD_FAILURE);
    this.crossComponentEventService.signalDataLoadComplete();
  }

  private onDataLoadComplete() {
    // Trigger UI update, notifying Angular of GAPI-induced model changes.
    // Polling GAPI for completion does work, but this is preferable currently.
    this.googleExternalEventsCompleted.nativeElement.click();
  }
  
  // Triggered by googleExternalEventsCompleted event
  onGoogleExternalEventsCompleted() {
    // TODO: Handle any necessary user dialog here
  }
  
}
