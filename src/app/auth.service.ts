import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
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

  onGoogleLoad(gapi: any) {
    var googleAuth = gapi.auth2.init({
      client_id: AuthService.client_id,
      scope: AuthService.scope
    }).then((response) => {
      console.log('Success initializing gapi.auth2.');
    }).catch((errorHandler) => {
      console.log('Error in AppComponent.signIn: ' + ((errorHandler == null || errorHandler.result == null) ? "undefined errorHandler" : errorHandler.result.error.message));
    });

    console.log("Wiring up auth events.");
    googleAuth.then(this.onGoogleAuthInit, this.onGoogleAuthError);
  }

  onGoogleAuthInit() {
    // trigger method with local scope
    window['triggerGoogleAuthInitialized'].click();
  }

  onGoogleAuthError(error:any){
    console.log("Error from GoogleAuth!");
    // TODO: Handle this case
    // https://developers.google.com/identity/sign-in/web/reference#gapiauth2clientconfig
  }

  onGoogleAuthInitialized(gapi: any){
    // Wire up listener to watch for sign-in state change
    gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
    
    // Handle the initial sign-in state.
    this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  }

  updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      console.log("GoogleAuth: Status change, user IS signed in");
      // trigger method with local scope
      window['triggerGoogleAuthIsSignedIn'].click();
    } else {
      console.log("GoogleAuth: Status change, NOT signed in.");
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
    }).then(function () {
      // trigger method with local scope
      window['triggerGoogleGapiClientInitialized'].click();
    }).catch((errorHandler) => {
      console.log('Error in AppComponent.loadGapiClient: ' + ((errorHandler == null || errorHandler.result == null) ? "undefined errorHandler" : errorHandler.result.error.message));
    });
  }

  // Triggered by GAPI client via form
  onGoogleGapiClientInitialized() {
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

  isSignedIn(gapi: any): boolean {
    if (gapi == null || gapi.auth2 == null) {
      return false;
    }

    var auth2 = gapi.auth2.getAuthInstance();
    if (auth2 == null) {
      return false;
    }

    return auth2.isSignedIn.get();
  }
  
}
