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
  signedInFlag = false;

  constructor(private zone: NgZone, private meta: Meta) {
    this.meta.addTag({ name: 'google-signin-client_id', content: '782561556087-8vrgbd6393gagmenk100qmv4lfbpulrg.apps.googleusercontent.com' });
    this.meta.addTag({ name: 'google-signin-scope', content: 'https://www.googleapis.com/auth/tasks' });
  }

  ngAfterViewInit() {
    gapi.signin2.render('googleSigninButton', {
        'onsuccess': param => this.onSignIn(param),
        'scope': 'https://www.googleapis.com/auth/tasks',
        'longtitle': true,
        'theme': 'light',
        //TODO: 'onfailure': ...
      })
  }

  onSignIn(googleUser) {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);

    // Handle the initial sign-in state.
    this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  };

  onSignOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut();
    location.reload();
  }

  updateSigninStatus(isSignedIn) {
    // When signin status changes, this function is called.
    console.log('isSignedIn=' + isSignedIn);
    this.signedInFlag = isSignedIn;
  }

  isSignedIn() {
    return true;
    return this.signedInFlag;

    if (gapi == null || gapi.auth2 == null) {
      return false;
    }

    var auth2 = gapi.auth2.getAuthInstance();
    if (auth2 == null) {
      return false;
    }

    return auth2.isSignedIn.get();
  }

  testApiCall() {
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
