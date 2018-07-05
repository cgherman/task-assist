import { Component, NgZone } from '@angular/core';
import { Meta } from '@angular/platform-browser';
declare var gapi: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'TaskAssist';
  public auth2:any
  static client_id = "782561556087-8vrgbd6393gagmenk100qmv4lfbpulrg.apps.googleusercontent.com";
  static scope = "https://www.googleapis.com/auth/tasks";
  static discoveryDocs = "https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest";
  static api_key = "AIzaSyBke1n7BqFee0XcM7_WbIg337YsPrROgh0";

  constructor(private zone: NgZone, private meta: Meta) {
    this.meta.addTag({ name: 'google-signin-client_id', content: AppComponent.client_id });
    this.meta.addTag({ name: 'google-signin-scope', content: AppComponent.scope });
  }

  ngAfterViewInit() {
    gapi.load('auth2',  () => {
      this.auth2 = gapi.auth2.init({
        client_id: AppComponent.client_id,
        scope: AppComponent.scope
      });
      this.attachSignin(document.getElementById('glogin'));
    });

    gapi.load('client',  () => {
      this.auth2 = gapi.client.load('tasks', 'v1', () => {
        gapi.auth.authorize({ client_id: AppComponent.client_id, scope: AppComponent.scope, api_key: AppComponent.api_key, discoveryDocs: AppComponent.discoveryDocs }, authResult => {
          if (authResult && !authResult.error) {

            // Listen for sign-in state changes.
            gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);

            // Handle the initial sign-in state.
            this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

          } else {
            console.log("Unable to connect: " + authResult.error);
            /* TODO: handle authorization error */
          }
        });        
      });
    });
  }

  onSignIn(googleUser) {
  }

  public attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (loggedInUser) => {  
        console.log( loggedInUser);
      }, function (error) {
        // alert(JSON.stringify(error, undefined, 2));
      });
  }

  onSignOut() {
    gapi.auth2.getAuthInstance().signOut(
    ).then(function(response) {
      console.log('Successful sign-out.');
    }, function(rejectReason) {
      console.log('Error: ' + rejectReason.result.error.message);
    });

    location.reload();
  }

  updateSigninStatus(isSignedIn) {
    // When signin status changes, this function is called.
    console.log('isSignedIn=' + isSignedIn);

    // test some data
    if (isSignedIn) {
      gapi.client.tasks.tasklists.list({
      }).then(function(response) {
        var index: number;
        console.log('Successful sign-in.');
        for (index = 0; index < response.result.items.length; index++) {
          console.log(response.result.items[index].title);
        }
        console.log('Successful fetch of Task Lists.');
      }, function(rejectReason) {
        console.log('Error: ' + rejectReason.result.error.message);
      });
    }
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
