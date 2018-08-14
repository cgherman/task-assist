import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Meta } from '@angular/platform-browser';

import { ConfigService } from '../services/config.service';
import { GoogleAuthServiceBase } from '../services/google-auth-service-base';
import { AppComponent } from '../app.component';
import { ConfigResolverHandler } from '../resolvers/config-resolver-handler';

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

  private configResolverHandler: ConfigResolverHandler;

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

  set title(newValue: string) {
    this.appComponent.title = newValue;
  }

  ngOnInit() {
    // track auth events
    var sub = this.authService.authenticated.subscribe(item => this.onAuthenticated());
    this.subscriptions.push(sub); // capture for destruction

    sub = this.authService.failedToLoadAuth.subscribe(item => this.onFailedToLoadAuth());
    this.subscriptions.push(sub); // capture for destruction

    this.configureServices();
  }

  // ngOnDestroy needs to be present for @AutoUnsubscribe to function
  ngOnDestroy() {
  }
  
  private configureServices() {
    this.configResolverHandler = new ConfigResolverHandler();
    var sub = this.configResolverHandler.configResolved.subscribe(item => this.onConfigResolved(item));
    this.configResolverHandler.configure(this.route);
    this.subscriptions.push(sub); // capture for destruction
  }

  // Fired when config-resolver is handled
  onConfigResolved($event) {
    // fetch config elements from config
    let scope = this.configService.scope;
    let discoveryDocs = this.configService.discoveryDocs;
    let api_key = $event.api_key;
    let client_id = $event.client_id;

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
    this.appComponent.configIsResolved();    
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
