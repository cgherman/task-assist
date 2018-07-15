import { Component, Output, EventEmitter } from '@angular/core';
import { Meta } from '@angular/platform-browser';

import { TaskServiceBase } from './task-service-base';
import { TaskService } from './task.service';
import { AuthServiceBase } from './auth-service-base';
import { AuthService } from './auth.service';

declare var gapi: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  @Output() dataReadyToLoad: EventEmitter<any> = new EventEmitter();
  @Output() dataLoad: EventEmitter<any> = new EventEmitter();

  title = 'TaskAssist';
  gapi_client: any;

  constructor(private authService: AuthServiceBase, private taskService: TaskServiceBase, private meta: Meta) {
    // set up required meta tags for GAPI login
    this.meta.addTag({ name: 'google-signin-client_id', content: (this.authService as AuthService).client_id });
    this.meta.addTag({ name: 'google-signin-scope', content: (this.authService as AuthService).scope });

    // Wire up GAPI Auth
    const _self = this;
    window['onSignIn'] = function (googleUser) {
      _self.onSignIn(googleUser);
    };

    // track key auth event
    this.authService.Authenticated.subscribe(item => this.onGoogleGapiClientInitialized());
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  }

  onSignIn(googleUser) {
    this.signIn();
  }

  signIn() {
    (this.authService as AuthService).SetGapiReference(gapi);
    this.authService.signIn();
  }

  // Triggered by GAPI client via form
  onGoogleGapiClientInitialized() {
    (this.taskService as TaskService).setGapiFunctions(gapi.client.tasks.tasklists.list, gapi.client.tasks.tasks.list);
    this.onDataReadyToLoad();
  }

  private onDataReadyToLoad() {
    console.log("GAPI client initialized.  Ready for data load.");
    this.dataReadyToLoad.emit(null);
  }

  onSignOut() {
    this.authService.onSignOut();
  }
}