import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Meta } from '@angular/platform-browser';

import { MSG_GOOGLE_LOAD_FAILURE, MSG_MISSING_CONFIG,MSG_MISSING_API_KEY, MSG_MISSING_CLIENT_KEY } from '../user-messages';
import { AppComponent } from '../app.component';
import { GoogleAuthServiceBase } from '../../services/auth/google-auth-service-base';
import { ConfigHandlerService } from '../../services/config/config-handler.service';

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
              private meta: Meta,              
              private configHandlerService: ConfigHandlerService,
              private appComponent: AppComponent
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

  // exposure of Title text to child controls
  set title(newValue: string) {
    this.appComponent.title = newValue;
  }

  ngOnInit() {
    // track auth events
    var sub = this.authService.authenticated.subscribe(item => this.onAuthenticated());
    this.subscriptions.push(sub); // capture for destruction

    sub = this.authService.failedToLoadAuth.subscribe(item => this.onFailedToLoadAuth());
    this.subscriptions.push(sub); // capture for destruction

    this.initConfiguration();
  }
  
  private initConfiguration() {
    var sub = this.configHandlerService.configResolved.subscribe(item => this.onConfigResolved(item));
    this.configHandlerService.init(this.route);
    this.subscriptions.push(sub); // capture for destruction
  }

  // ngOnDestroy needs to be present for @AutoUnsubscribe to function
  ngOnDestroy() {
  }

  // Fired when config-resolver is handled
  onConfigResolved($event) {
    // fetch config elements from config
    let scope = $event.scope;
    let discoveryDocs = $event.discoveryDocs;
    let api_key = $event.api_key;
    let client_id = $event.client_id;

    // If API keys have not been configured, then show a message
    if (api_key == null || client_id == null) {
      if (api_key == null) {
        this.appComponent.headerMessageAppend(MSG_MISSING_API_KEY);
      }

      if (client_id == null) {
        this.appComponent.headerMessageAppend(MSG_MISSING_CLIENT_KEY);
      }

      this.appComponent.headerMessageAppend(MSG_MISSING_CONFIG);
    }

    // set Google config to enable auth
    this.authService.scope = scope;
    this.authService.discoveryDocs = discoveryDocs;
    this.authService.api_key = api_key;
    this.authService.client_id = client_id;

    this.meta.updateTag({ name: 'google-signin-scope', content: scope });
    this.meta.updateTag({ name: 'google-signin-client_id', content: client_id });

    // Config values are loaded; we can tell Google OAuth to go forth
    this.appComponent.bubbledConfigResolved();    
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
    this.appComponent.headerMessageAppend(MSG_GOOGLE_LOAD_FAILURE);
    this.bubbledBackgroundGoogleTasksDone();
  }

  // Handed control from above
  private onDataReadyToLoad() {
    // fire event indicating data service is ready
    console.log("GAPI client initialized.  Ready for data load.");
    this.dataReadyToLoad.emit(null);
  }

  public bubbledBackgroundGoogleTasksDone() {
    this.appComponent.bubbledBackgroundGoogleTasksDone();
  }

  // Triggered by form button
  onSignOut() {
    this.authService.signOut();
  }
  
}
