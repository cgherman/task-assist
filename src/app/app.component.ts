import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { Subscription } from 'rxjs';

import { TaskServiceBase } from './task-service-base';
import { TaskService } from './task.service';
import { AuthServiceBase } from './auth-service-base';
import { AuthService } from './auth.service';
import { ConfigService } from './config.service';

declare var gapi: any;

@AutoUnsubscribe({includeArrays: true})
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnDestroy {
  @Output() dataReadyToLoad: EventEmitter<any> = new EventEmitter();
  @Output() dataLoad: EventEmitter<any> = new EventEmitter();

  private title = 'TaskAssist';
  private gapi_client: any;

  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];

  constructor(private authService: AuthServiceBase,
              private taskService: TaskServiceBase,
              private configService: ConfigService,
              private meta: Meta) {

    // Wire up GAPI Auth
    const _self = this;
    window['onSignIn'] = function (googleUser) {
      _self.onSignIn(googleUser);
    };
  }

  ngOnInit() {
    // track key auth event
    var sub = this.authService.Authenticated.subscribe(item => this.onAuthenticated());
    this.subscriptions.push(sub); // capture for destruction

    this.configureServices();
  }

  // ngOnDestroy needs to be present for @AutoUnsubscribe to function
  ngOnDestroy() {
  }

  private configureServices() {
    // fetch scope and discovery context from Google Task Service
    let scope = (this.taskService as TaskService).scope;
    let discoveryDocs = (this.taskService as TaskService).discoveryDocs;

    // set Google scope and discoveryDocs to enable auth
    this.meta.addTag({ name: 'google-signin-scope', content: scope });
    (this.authService as AuthService).scope = scope;
    (this.authService as AuthService).discoveryDocs = discoveryDocs;

    // fetch API keys from JSON file
    var sub = this.configService.getApiKeys().subscribe(config => {
      // fetch config elements from config
      let api_key = config.api_key;
      let client_id = config.client_id;

      // set Google scope and discoveryDocs to enable auth
      this.meta.addTag({ name: 'google-signin-client_id', content: client_id });
      (this.authService as AuthService).api_key = api_key;
      (this.authService as AuthService).client_id = client_id;
    });

    this.subscriptions.push(sub); // capture for destruction
  }

  ngAfterViewInit(): void {
  }

  // Triggered by Google login button
  onSignIn(googleUser) {
    this.signIn();
  }

  // begin the sign-in/authorization process
  signIn() {
    // wire up auth service dependency
    (this.authService as AuthService).setGapiReference(gapi);

    // sign in using authorization service
    this.authService.signIn();
  }

  // Triggered by authorization service
  onAuthenticated() {
    // ready to load our data
    (this.taskService as TaskService).setGapiReference(gapi);
    this.onDataReadyToLoad();
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