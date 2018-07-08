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
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.signIn();
  }

  signIn() {
    gapi.load('client:auth2',  () => {
      var googleAuth = gapi.auth2.init({
        client_id: AuthService.client_id,
        scope: AuthService.scope
      }).then((response) => {
        console.log('Success initializing gapi.auth2.');
      }, function(errorHandler) {
        console.log('Error in AppComponent.signIn: ' + ((errorHandler == null || errorHandler.result == null) ? "undefined errorHandler" : errorHandler.result.error.message));
      });

      console.log("Wiring up auth events.");
      googleAuth.then(this.onGoogleAuthInit, this.onGoogleAuthError);
    });
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

  // Triggered by GAPI client via form
  onGoogleAuthInitialized(){
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

  // Triggered by GAPI client via form
  onGoogleAuthIsSignedIn() {
      this.loadGapiClient();
  }

  private loadGapiClient() {
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
    }, function(errorHandler) {
      console.log('Error in AppComponent.loadGapiClient: ' + ((errorHandler == null || errorHandler.result == null) ? "undefined errorHandler" : errorHandler.result.error.message));
    });
  }

  // Triggered by GAPI client via form
  onGoogleGapiClientInitialized() {
    this.taskService.setProviders(gapi.client.tasks.tasklists.list, gapi.client.tasks.tasks.list);
    console.log("GAPI client initialized.  Ready for data load.");
    this.onDataReadyToLoad();
  }

  private onDataReadyToLoad() {
    this.dataReadyToLoad.emit(null);
  }

  onSignOut() {
    // log out
    gapi.auth2.getAuthInstance().disconnect();
    gapi.auth2.getAuthInstance().signOut(
    ).then((response) => {
      console.log('Successful sign-out.');
      setTimeout(() => location.reload(), 1000);
    }, function(errorHandler) {
      console.log('Error in AppComponent.onSignOut: ' + ((errorHandler == null || errorHandler.result == null) ? "undefined errorHandler" : errorHandler.result.error.message));
    });
  }

  isSignedIn() {
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
