import { Output, EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable, empty } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, delay, catchError, first } from 'rxjs/operators'; 
import { AuthServiceBase } from './auth-service-base';

@Injectable({
  providedIn: 'root'
})

export class AuthService implements AuthServiceBase {
  @Output() Authenticated: EventEmitter<any> = new EventEmitter();
  @Output() googleAuthInit: EventEmitter<any> = new EventEmitter();
  @Output() googleAuthError: EventEmitter<any> = new EventEmitter();

  private _client_id: string = null;
  private _scope: string = null;
  private _api_key: string = null;
  private _discoveryDocs: string[] = null;

  private _gapi_reference = null;

  constructor(private http: HttpClient) {
  }

  get api_key(): string {
    if (this._api_key == null) {
      this._api_key = "AIzaSyBke1n7BqFee0XcM7_WbIg337YsPrROgh0";
      }
    return this._api_key;
  }

  get client_id(): string {
    if (this._client_id == null) {
      this._client_id =  "782561556087-8vrgbd6393gagmenk100qmv4lfbpulrg.apps.googleusercontent.com";
    }
    return this._client_id;
  }

  get discoveryDocs(): string[]{
    if (this._discoveryDocs == null) {
      this._discoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest"];
    }
    return this._discoveryDocs;
  }

  get scope(): string{
    if (this._scope == null) {
      this._scope = "https://www.googleapis.com/auth/tasks";
    }
    return this._scope;
  }

  // TODO: Fetch values and put into meta tags for Google Auth in AppComponent
  // Method to fetch app-specific JSON file for GAPI config
  // Create a new project & corresponding credentials here: https://console.developers.google.com/apis/credentials
  public getJSON(filename: string): Observable<any> {
    return this.http.get(filename)
      .pipe(
        map((response: Response) => {
          return response;
        })
      );
  }

  // Set reference to Google API
  public SetGapiReference(gapi: any) {
    this._gapi_reference = gapi;
  }

  // return auth status
  public isAuthenticated(): boolean {
    if (this._gapi_reference == null) {
      return false;
    }

    var googleAuth = this._gapi_reference.auth2.getAuthInstance();
    return googleAuth.isSignedIn.get();
  }

  // trigger sign-in
  signIn() {
    this.loadGoogleClients();
  }

  private loadGoogleClients() {
    this._gapi_reference.load('client:auth2', () => {
      this.onGoogleLoad();
    });
  }

  // Upon API initial load, initialize OAuth2
  private onGoogleLoad() {
    var googleAuth = this._gapi_reference.auth2.init({
      client_id: this.client_id,
      scope: this.scope
    }).then(() => this.onGoogleAuthInitialized(), () => this.onGoogleAuthError);
  }

  // Upon successful OAuth2 init
  onGoogleAuthInitialized(){
    console.log('Success initializing gapi.auth2.');

    // Wire up listener to watch for sign-in state change
    var googleAuth: any; 
    googleAuth = this._gapi_reference.auth2.getAuthInstance();

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
    console.log("discoveryDocs:" + this.discoveryDocs);
    console.log("scope:" + this.scope);
    this._gapi_reference.client.init({
      apiKey: this.api_key,
      discoveryDocs: this.discoveryDocs,
      clientId: this.client_id,
      scope: this.scope
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
    this._gapi_reference.auth2.getAuthInstance().disconnect();
    this._gapi_reference.auth2.getAuthInstance().signOut(
    ).then((response) => {
      console.log('Successful sign-out.');
      setTimeout(() => location.reload(), 1000);
    }).catch((errorHandler) => {
      console.log('Error in AuthService.onSignOut: ' + ((errorHandler == null || errorHandler.result == null) ? "undefined errorHandler" : errorHandler.result.error.message));
    });  
  }

}
