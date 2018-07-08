import { Output, EventEmitter } from '@angular/core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  @Output() googleGapiClientInitialized: EventEmitter<any> = new EventEmitter();
  @Output() googleGapiSignedIn: EventEmitter<any> = new EventEmitter();
  @Output() googleAuthInit: EventEmitter<any> = new EventEmitter();
  @Output() googleAuthError: EventEmitter<any> = new EventEmitter();

  static client_id = "782561556087-8vrgbd6393gagmenk100qmv4lfbpulrg.apps.googleusercontent.com";
  static scope = "https://www.googleapis.com/auth/tasks";
  static discoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest"];
  static api_key = "AIzaSyBke1n7BqFee0XcM7_WbIg337YsPrROgh0";

  //TODO: Put config files in private JSON object to avoid checking in to Git
  //// Get API key and OAuth client ID from app-specific JSON file
  //// Create a new project & corresponding credentials here: https://console.developers.google.com/apis/credentials
  //$.getJSON('/assets/api_key.json', function(data) {
  //  initClient(data.api_key, data.client_id);
  //});

  constructor() {
  }

  signIn(gapi: any) {
    gapi.load('client:auth2', () => {
      this.onGoogleLoad(gapi);
    });
  }

  private onGoogleLoad(gapi: any) {
    var googleAuth = gapi.auth2.init({
      client_id: AuthService.client_id,
      scope: AuthService.scope
    }).then((response) => {
      console.log('Success initializing gapi.auth2.');
    }).catch((errorHandler) => {
      console.log('Error in AppComponent.signIn: ' + ((errorHandler == null || errorHandler.result == null) ? "undefined errorHandler" : errorHandler.result.error.message));
    });

    console.log("Wiring up auth events.");
    googleAuth.then(() => this.onGoogleAuthInitialized(gapi), () => this.onGoogleAuthError);
  }

  onGoogleAuthInitialized(gapi: any){
    // Wire up listener to watch for sign-in state change
    var googleAuth: any; 
    googleAuth = gapi.auth2.getAuthInstance();

    // Wire up listener to watch for sign-in state change
    googleAuth.isSignedIn.listen((() => { this.updateSigninStatus3(gapi); }));
    
    // Handle the initial sign-in state.
    this.updateSigninStatus3(gapi);
  }

  onGoogleAuthError(error:any){
    console.log("Error from GoogleAuth!");
    // TODO: Handle this case
    // https://developers.google.com/identity/sign-in/web/reference#gapiauth2clientconfig
  }

  updateSigninStatus3(gapi: any) {
    var googleAuth: any; 
    googleAuth = gapi.auth2.getAuthInstance();

    if (googleAuth.isSignedIn.get()) {
      console.log("GoogleAuth: Status check: user IS signed in");
      this.googleGapiSignedIn.emit();
    } else {
      console.log("GoogleAuth: Status check: NOT signed in yet.");
    }
  }

  onGoogleAuthIsSignedIn(gapi: any) {
    this.loadGapiClient(gapi);
  }

  private loadGapiClient(gapi: any) {
    console.log('Loading GAPI client.');    
    console.log("discoveryDocs:" + AuthService.discoveryDocs);
    console.log("scope:" + AuthService.scope);
    gapi.client.init({
      apiKey: AuthService.api_key,
      discoveryDocs: AuthService.discoveryDocs,
      clientId: AuthService.client_id,
      scope: AuthService.scope
    }).then((response) => {
      // TODO: current method forces refresh, but not ideal
      window['triggerGoogleGapiClientInitialized'].click();
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
      console.log('Error in AppComponent.onSignOut: ' + ((errorHandler == null || errorHandler.result == null) ? "undefined errorHandler" : errorHandler.result.error.message));
    });  
  }

  /* isSignedIn(gapi: any): boolean {
    if (gapi == null) {
      console.log("GAPI object cannot be verified during sign-in.");
      return false;
    }
    if (gapi.auth2 == null) {
      console.log("GAPI Auth2 object cannot be verified during sign-in.");
      return false;
    }

    var authInstance = gapi.auth2.getAuthInstance();
    if (authInstance == null) {
      console.log("GAPI auth instance cannot be verified.");
      return false;
    }

    return authInstance.isSignedIn.get();
  } */
  
}
