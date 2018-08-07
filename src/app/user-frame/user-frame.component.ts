import { Component, Output, ViewChild, ElementRef, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Meta } from '@angular/platform-browser';

import { ConfigService } from '../services/config.service';
import { GoogleAuthServiceBase } from '../services/google-auth-service-base';
import { AppComponent } from '../app.component';
import { log } from 'util';

@AutoUnsubscribe({includeArrays: true})
@Component({
  selector: 'app-frame',
  templateUrl: './user-frame.component.html',
  styleUrls: ['./user-frame.component.css']
})
export class UserFrameComponent implements OnInit, OnDestroy {
  @Output() dataReadyToLoad: EventEmitter<any> = new EventEmitter();

  // Messages to help you set up your instance
  private _missing_config = "You need to deploy api_key.json to your assets folder.";  
  private _missing_api_key = "API key was not found!";
  private _missing_client_key = "Client ID was not found!";

  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];

  constructor(private authService: GoogleAuthServiceBase,
              private route: ActivatedRoute,
              private configService: ConfigService,
              private meta: Meta,
              private appComponent: AppComponent
            ) {

    // Wire up GAPI Auth actions
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

    this.configureServices();
  }

  set title(newValue: string) {
    this.appComponent.title = newValue;
  }

  private configureServices() {
    var sub = this.route.data.subscribe((data: { config: any }) => {

      // fetch config elements from config
      let scope = this.configService.scope;
      let discoveryDocs = this.configService.discoveryDocs;
      let api_key = this.configService.apiKeyFromConfig(data.config);
      let client_id = this.configService.clientIdFromConfig(data.config);

      // If API keys have not been configured, then show a message
      if (api_key == null || client_id == null) {
        if (api_key == null) {
          this.appComponent.headerMessageAppend(this._missing_api_key);
        }

        if (client_id == null) {
          this.appComponent.headerMessageAppend(this._missing_client_key);
        }

        this.appComponent.headerMessageAppend(this._missing_config);
      }

      // set Google config to enable auth
      this.authService.scope = scope;
      this.authService.discoveryDocs = discoveryDocs;
      this.authService.api_key = api_key;
      this.authService.client_id = client_id;

      this.meta.updateTag({ name: 'google-signin-scope', content: scope });
      this.meta.updateTag({ name: 'google-signin-client_id', content: client_id });

      // Config values are loaded; we can tell Google OAuth to go forth
      this.configService.configIsResolved();
    });
    this.subscriptions.push(sub); // capture for destruction
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
    this.appComponent.headerMessageAppend(this.appComponent._googleLoadFailure);
    this.backgroundGoogleTasksDone();
  }

  // Handed control from above
  private onDataReadyToLoad() {
    // fire event indicating data service is ready
    console.log("GAPI client initialized.  Ready for data load.");
    this.dataReadyToLoad.emit(null);
  }

  public backgroundGoogleTasksDone() {
    this.appComponent.backgroundGoogleTasksDone();
  }

  // Triggered by form button
  onSignOut() {
    this.authService.signOut();
  }
  
}
