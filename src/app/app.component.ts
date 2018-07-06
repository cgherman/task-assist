import { Component, ViewChild, NgZone } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { TaskService } from './task.service';
import { TaskList, RootTask } from './data-model';
import { QuadrantComponent } from './quadrant/quadrant.component'
import { AuthService } from './auth.service';

declare var gapi: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  @ViewChild(QuadrantComponent) child: QuadrantComponent;
  static childref: QuadrantComponent;
  title = 'TaskAssist';
  gapi_client:any;
  auth2:any;
  taskService: TaskService;

  constructor(private zone: NgZone, private meta: Meta, private authService: AuthService) {
    this.meta.addTag({ name: 'google-signin-client_id', content: AuthService.client_id });
    this.meta.addTag({ name: 'google-signin-scope', content: AuthService.scope });
    this.authService = authService;
    AppComponent.childref = this.child;
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
      setTimeout(() => this.signIn(), 1000);
  }

  signIn() {
    gapi.load('auth2',  () => {
      this.auth2 = gapi.auth2.init({
        client_id: AuthService.client_id,
        scope: AuthService.scope
      });
      this.attachSignin(document.getElementById('glogin'));
    });
  
    gapi.load('client:auth2',  () => {
      this.gapi_client = gapi.client.load('tasks', 'v1', () => {
        gapi.auth.authorize({ client_id: AuthService.client_id, scope: AuthService.scope }, authResult => {
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

  attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (loggedInUser) => {  
        console.log( loggedInUser);
      }, function (error) {
        // alert(JSON.stringify(error, undefined, 2));
      });
  }

  updateSigninStatus(isSignedIn) {
    // When signin status changes, this function is called.
    console.log('isSignedIn=' + isSignedIn);

    // test some data
    if (isSignedIn) {
      console.log('Successful sign-in.');

      // Let's build the model while we have the chance
      this.BuildModel();

    }
  }

  onSignIn(googleUser) {
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

  BuildModel() {
    // Use the GAPI module to fetch data and build arrays
    // This is a mess because the GAPI object doesn't play nice with services
    console.log("Building the model...");

    let taskLists = new Map<string, TaskList>(); 
    let tasks = new Map<string, RootTask>(); 

    gapi.client.tasks.tasklists.list({
    }).then(function(response) {
      var index: number;
      if (response.result == null || response.result.items == null || response.result.items.length == 0) {
        console.log('No Task Lists found.');
      } else {
        console.log('Found ' + response.result.items.length + ' Task LISTS.');
        var index: number;
        for (index = 0; index < response.result.items.length; index++) {
          taskLists[response.result.items[index].id] =
                    new TaskList(response.result.items[index].id,
                    response.result.items[index].title);
          console.log('Building list: ' + response.result.items[index].title);

          gapi.client.tasks.tasks.list( {tasklist: response.result.items[index].id }
          ).then(function(response) {
            if (response.result == null || response.result.items == null || response.result.items.length == 0) {
              console.log('Empty List.');
            } else {
              var index: number;
              for (index = 0; index < response.result.items.length; index++) {
                var task = new RootTask(response.result.items[index].id,
                                        response.result.items[index].title,
                                        response.result.items[index].selfLink,
                                        response.result.items[index].status,
                                        response.result.items[index].notes);
                var listId = response.result.items[index].selfLink;
                var firstPos = listId.indexOf("/tasks/v1/lists/");
                listId = listId.substring(firstPos + 16, listId.length);
                var secondPos = listId.indexOf("/tasks/");
                listId = listId.substring(0, secondPos);
                tasks[listId] = task;

                // Done collecting data
                TaskService.bind("S");
                //this.child.populateModels();
              }
            }

          }), function(rejectReason) {
            console.log('Error: ' + rejectReason.result.error.message);
          };
        }
      }
    }), function(rejectReason) {
      console.log('Error: ' + rejectReason.result.error.message);
    };
  }

}
