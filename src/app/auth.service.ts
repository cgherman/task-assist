import { Output, EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable, empty } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, delay, catchError, first } from 'rxjs/operators'; 

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  @Output() googleGapiClientInitialized: EventEmitter<any> = new EventEmitter();
  @Output() googleAuthInit: EventEmitter<any> = new EventEmitter();
  @Output() googleAuthError: EventEmitter<any> = new EventEmitter();

  private _client_id: string = null;
  private _scope: string = null;
  private _api_key: string = null;
  private _discoveryDocs: string[] = null;

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

  public isAuthenticated(): boolean {

    // TODO: Use gapi instance to check auth status

    return true;
  }

  signIn(gapi: any) {
    this.loadGoogleClients(gapi);
  }

  private loadGoogleClients(gapi: any) {
    gapi.load('client:auth2', () => {
      this.onGoogleLoad(gapi);
    });
  }

  private onGoogleLoad(gapi: any) {
    var googleAuth = gapi.auth2.init({
      client_id: this.client_id,
      scope: this.scope
    }).then((response) => {
      console.log('Success initializing gapi.auth2.');
    }).catch((errorHandler) => {
      console.log('Error in AuthService.onGoogleLoad: ' + ((errorHandler == null || errorHandler.result == null) ? "undefined errorHandler" : errorHandler.result.error.message));
    });

    console.log("Wiring up auth events.");
    googleAuth.then(() => this.onGoogleAuthInitialized(gapi), () => this.onGoogleAuthError);
  }

  onGoogleAuthInitialized(gapi: any){
    // Wire up listener to watch for sign-in state change
    var googleAuth: any; 
    googleAuth = gapi.auth2.getAuthInstance();

    // Wire up listener to watch for sign-in state change
    googleAuth.isSignedIn.listen((() => { this.updateSigninStatus(gapi); }));
    
    // Handle the initial sign-in state.
    this.updateSigninStatus(gapi);
  }

  onGoogleAuthError(error:any){
    console.log("Error from GoogleAuth!");
    // TODO: Handle this case
    // https://developers.google.com/identity/sign-in/web/reference#gapiauth2clientconfig
  }

  updateSigninStatus(gapi: any) {
    var googleAuth: any; 
    googleAuth = gapi.auth2.getAuthInstance();

    if (googleAuth.isSignedIn.get()) {
      console.log("GoogleAuth: Status check: user IS signed in");
      this.loadGapiClient(gapi);
    } else {
      console.log("GoogleAuth: Status check: NOT signed in yet.");
    }
  }

  private loadGapiClient(gapi: any) {
    console.log('Loading GAPI client.');    
    console.log("discoveryDocs:" + this.discoveryDocs);
    console.log("scope:" + this.scope);
    gapi.client.init({
      apiKey: this.api_key,
      discoveryDocs: this.discoveryDocs,
      clientId: this.client_id,
      scope: this.scope
    }).then((response) => {
      this.onGoogleGapiClientInitialized();
    }).catch((errorHandler) => {
      console.log('Error in AppComponent.loadGapiClient: ' + ((errorHandler == null || errorHandler.result == null) ? "undefined errorHandler" : errorHandler.result.error.message));
    });
  }

  // Triggered by GAPI client via form
  onGoogleGapiClientInitialized() {
    this.googleGapiClientInitialized.emit();
  }

  onSignOut(gapi: any) {
    // log out
    gapi.auth2.getAuthInstance().disconnect();
    gapi.auth2.getAuthInstance().signOut(
    ).then((response) => {
      console.log('Successful sign-out.');
      setTimeout(() => location.reload(), 1000);
    }).catch((errorHandler) => {
      console.log('Error in AuthService.onSignOut: ' + ((errorHandler == null || errorHandler.result == null) ? "undefined errorHandler" : errorHandler.result.error.message));
    });  
  }

}
