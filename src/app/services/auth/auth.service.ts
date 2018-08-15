import { Output, EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { GapiWrapperService } from '../shared/gapi-wrapper.service';
import { GoogleAuthServiceBase } from './google-auth-service-base';

@Injectable({
  providedIn: 'root'
})

export class AuthService extends GoogleAuthServiceBase {
  @Output() authenticated: EventEmitter<any> = new EventEmitter();
  @Output() failedToLoadAuth: EventEmitter<any> = new EventEmitter();

  private _api_key: string = null;
  private _client_id: string = null;
  private _scope: string = null;
  private _discoveryDocs: string[] = null;

  constructor(private gapiWrapper: GapiWrapperService) {
    super();
  }

  set api_key(newValue: string) {
    this._api_key = newValue;
  }

  set client_id(newValue: string) {
    this._client_id = newValue;
  }

  set scope(newValue: string) {
    this._scope = newValue;
  }

  set discoveryDocs(newValue: string[]) {
    this._discoveryDocs = newValue;
  }

  // return auth status
  public isAuthenticated(): boolean {
    var googleAuthInstance = this.googleAuthInstance();

    if (googleAuthInstance == null) {
      return false;
    }
    
    try {
      return googleAuthInstance.isSignedIn.get();
    }
    catch(err) {
      // suppress errors due to API load issues
      return false;
    }
  }

  private googleAuthInstance(): any {
    // Check to make sure that API script wasn't blocked
    if (this.gapiWrapper.instance == null || this.gapiWrapper.instance.auth2 == null) {
      return null;
    }

    var googleAuth = this.gapiWrapper.instance.auth2.getAuthInstance();
    if (googleAuth == null) {
      return null;
    }
    
    return googleAuth;
  }

  // trigger sign-in
  signIn() {
    this.loadGoogleClients();
  }

  private loadGoogleClients() {
    if (this.shouldHaltDueToLoadIssue()) {
      return;
    }

    this.gapiWrapper.instance.load('client:auth2', () => {
      this.onGoogleLoad();
    });
  }

  private shouldHaltDueToLoadIssue(): boolean {
    if (this.googleAuthInstance() == null) {
      // Fatal issue: Google Javascript likely hasn't loaded due to ad blocker
      this.halt();
      return true;
    }

    return false;
  }

  private halt() {
    console.log("Google core content was not loaded!  Halting!");
    this.failedToLoadAuth.emit();
  }

  // Upon API initial load, initialize OAuth2
  private onGoogleLoad() {
    if (this.shouldHaltDueToLoadIssue()) {
      return;
    }

    var googleAuth = this.gapiWrapper.instance.auth2.init({
      client_id: this._client_id,
      scope: this._scope
    }).then(() => this.onGoogleAuthInitialized(), () => this.onGoogleAuthError);
  }

  // Upon successful OAuth2 init
  onGoogleAuthInitialized(){
    console.log('Success initializing gapi.auth2.');

    // Wire up listener to watch for sign-in state change
    var googleAuth: any; 
    googleAuth = this.gapiWrapper.instance.auth2.getAuthInstance();

    // Wire up listener to watch for sign-in state change
    googleAuth.isSignedIn.listen((() => { this.updateSigninStatus(); }));
    
    // Handle the initial sign-in state.
    this.updateSigninStatus();
  }

  // upon failed OAuth2 init
  onGoogleAuthError(error:any){
    console.log("Error from GoogleAuth!");
    // TODO: Handle this case
    // this.halt(); <-- test this code for this scenario
    // more info: https://developers.google.com/identity/sign-in/web/reference#gapiauth2clientconfig
  }

  // Triggered when sign-in status changes
  updateSigninStatus() {
    if (this.isAuthenticated()) {
      console.log("GoogleAuth: Status check: user IS signed in");
      this.loadGapiClient();
    } else {
      console.log("GoogleAuth: Status check: NOT signed in.");
    }
  }

  // If user is authenticated, then let's load the API client
  private loadGapiClient() {
    console.log('Loading GAPI client.');    
    console.log("discoveryDocs: " + this._discoveryDocs);
    console.log("scope: " + this._scope);

    // initialize GAPI client
    this.gapiWrapper.instance.client.init({
      apiKey: this._api_key,
      discoveryDocs: this._discoveryDocs,
      clientId: this._client_id,
      scope: this._scope
    }).then((response) => {
      this.onAuthenticated();
    }).catch((errorHandler) => {
      console.log('Error in AppComponent.loadGapiClient: ' + ((errorHandler == null || errorHandler.result == null) ? "undefined errorHandler" : errorHandler.result.error.message));
    });
  }

  // Triggered when API client is fully authorized and loaded
  onAuthenticated() {
    this.authenticated.emit();
  }

  // Method used to sign out of Google and revoke app access
  signOut() {
    // log out
    this.gapiWrapper.instance.auth2.getAuthInstance().disconnect();
    this.gapiWrapper.instance.auth2.getAuthInstance().signOut(
    ).then((response) => {
      console.log('Successful sign-out.');
      setTimeout(() => location.reload(), 1000);
    }).catch((errorHandler) => {
      console.log('Error in AuthService.signOut: ' + ((errorHandler == null || errorHandler.result == null) ? "undefined errorHandler" : errorHandler.result.error.message));
    });  
  }

}
