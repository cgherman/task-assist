import { Output, EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { AuthServiceBase } from './auth-service-base';

@Injectable({
  providedIn: 'root'
})

export class AuthService implements AuthServiceBase {
  @Output() Authenticated: EventEmitter<any> = new EventEmitter();
  @Output() googleAuthInit: EventEmitter<any> = new EventEmitter();
  @Output() googleAuthError: EventEmitter<any> = new EventEmitter();

  private _api_key: string = null;
  private _client_id: string = null;
  private _scope: string = null;
  private _discoveryDocs: string[] = null;

  private _gapiReference = null;

  constructor() {
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

  // Set reference to Google API
  public setGapiReference(gapi: any) {
    this._gapiReference = gapi;
  }

  // return auth status
  public isAuthenticated(): boolean {
    if (this._gapiReference == null) {
      return false;
    }

    var googleAuth = this._gapiReference.auth2.getAuthInstance();
    return googleAuth.isSignedIn.get();
  }

  // trigger sign-in
  signIn() {
    this.loadGoogleClients();
  }

  private loadGoogleClients() {
    this._gapiReference.load('client:auth2', () => {
      this.onGoogleLoad();
    });
  }

  // Upon API initial load, initialize OAuth2
  private onGoogleLoad() {
    var googleAuth = this._gapiReference.auth2.init({
      client_id: this._client_id,
      scope: this._scope
    }).then(() => this.onGoogleAuthInitialized(), () => this.onGoogleAuthError);
  }

  // Upon successful OAuth2 init
  onGoogleAuthInitialized(){
    console.log('Success initializing gapi.auth2.');

    // Wire up listener to watch for sign-in state change
    var googleAuth: any; 
    googleAuth = this._gapiReference.auth2.getAuthInstance();

    // Wire up listener to watch for sign-in state change
    googleAuth.isSignedIn.listen((() => { this.updateSigninStatus(); }));
    
    // Handle the initial sign-in state.
    this.updateSigninStatus();
  }

  // upon failed OAuth2 init
  onGoogleAuthError(error:any){
    console.log("Error from GoogleAuth!");
    // TODO: Handle this case
    // https://developers.google.com/identity/sign-in/web/reference#gapiauth2clientconfig
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
    this._gapiReference.client.init({
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
    this.Authenticated.emit();
  }

  // Method used to sign out of Google and revoke app access
  signOut() {
    // log out
    this._gapiReference.auth2.getAuthInstance().disconnect();
    this._gapiReference.auth2.getAuthInstance().signOut(
    ).then((response) => {
      console.log('Successful sign-out.');
      setTimeout(() => location.reload(), 1000);
    }).catch((errorHandler) => {
      console.log('Error in AuthService.signOut: ' + ((errorHandler == null || errorHandler.result == null) ? "undefined errorHandler" : errorHandler.result.error.message));
    });  
  }

}
