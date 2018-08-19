import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { Subscription } from 'rxjs';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { MSG_GOOGLE_LOAD_FAILURE } from '../../user-messages';
import { GoogleAuthServiceBase } from '../../services/auth/google-auth-service-base';
import { CrossComponentEventService } from '../../services/shared/cross-component-event.service';
import { ConfigAppService } from '../../services/config/config-app.service';

@AutoUnsubscribe({includeArrays: true})
@Component({
  selector: 'app-frame',
  templateUrl: './user-frame.component.html',
  styleUrls: ['./user-frame.component.css']
})
export class UserFrameComponent implements OnInit, OnDestroy {
  @Output() dataReadyToLoad: EventEmitter<any> = new EventEmitter();

  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];

  constructor(private authService: GoogleAuthServiceBase,
              private route: ActivatedRoute,     
              private configAppService: ConfigAppService,
              private appEventsService: CrossComponentEventService
            ) {

    // Wire up Google Auth actions
    const _self = this;
    window['onSignIn'] = function (googleUser) {
      _self.onSignIn(googleUser);
    };
    window['onSignOut'] = function () {
      _self.onSignOut();
    };
  }

  ngOnInit() {
    // track auth events
    var sub = this.authService.authenticated.subscribe(item => this.onAuthenticated());
    this.subscriptions.push(sub); // capture for destruction

    sub = this.authService.failedToLoadAuth.subscribe(item => this.onFailedToLoadAuth());
    this.subscriptions.push(sub); // capture for destruction

    this.configAppService.init(this.route);
  }

  // ngOnDestroy needs to be present for @AutoUnsubscribe to function
  ngOnDestroy() {
  }

  // Triggered by Google login button
  onSignIn(googleUser) {
    this.signIn();
  }

  // begin the sign-in/authorization process
  signIn() {
    // sign in using authorization service
    this.authService.signIn();
  }

  // Triggered by authorization service
  onAuthenticated() {
    // ready to load our data
    this.onDataReadyToLoad();
  }

  onFailedToLoadAuth() {
    console.log("Google Auth Failed to Load!");
    this.appEventsService.requestHeaderMessageAppend.emit(MSG_GOOGLE_LOAD_FAILURE);
    this.appEventsService.fireBackgroundGoogleTasksDone();
  }

  // Handed control from above
  private onDataReadyToLoad() {
    // fire event indicating data service is ready
    console.log("GAPI client initialized.  Ready for data load.");
    this.dataReadyToLoad.emit(null);
  }

  // Triggered by form button
  onSignOut() {
    this.authService.signOut();
  }
  
}
