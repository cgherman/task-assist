import { Component, Output, EventEmitter, NgZone } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { TaskService } from './task.service';
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

  constructor(private zone: NgZone, private meta: Meta, private authService: AuthService, private taskService: TaskService) {
    this.meta.addTag({ name: 'google-signin-client_id', content: AuthService.client_id });
    this.meta.addTag({ name: 'google-signin-scope', content: AuthService.scope });

    authService.googleGapiClientInitialized.subscribe(item => this.onGoogleGapiClientInitialized());
    authService.googleGapiSignedIn.subscribe(item => this.onGoogleGapiSignedIn());
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.signIn();
  }

  signIn() {
    this.authService.signIn(gapi, this.onGoogleAuthInit, this.onGoogleAuthError);
  }

  onGoogleAuthError(error:any){
    console.log("Error from GoogleAuth!");
    // TODO: Handle this case
    // https://developers.google.com/identity/sign-in/web/reference#gapiauth2clientconfig
  }

  onGoogleAuthInit() {
    // trigger method via JS to get back to local scope & get GAPI handle
    this.authService.onGoogleAuthInitialized(gapi);
  }

  onGoogleGapiSignedIn() {
    this.authService.onGoogleAuthIsSignedIn(gapi);
  }

  // Triggered by GAPI client via form
  onGoogleGapiClientInitialized() {
    this.taskService.setProviders(gapi.client.tasks.tasklists.list, gapi.client.tasks.tasks.list);
    this.onDataReadyToLoad();
  }

  private onDataReadyToLoad() {
    console.log("GAPI client initialized.  Ready for data load.");
    this.dataReadyToLoad.emit(null);
    window['triggerRefresh'].click();
  }

  onSignOut() {
    this.authService.onSignOut(gapi);
  }

  isSignedIn(): boolean {
    return this.authService.isSignedIn(gapi);
  }

}