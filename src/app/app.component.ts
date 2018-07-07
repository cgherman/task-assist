import { Component, Output, EventEmitter, NgZone } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { TaskService } from './task.service';
import { ITask, ITaskList, TaskList, RootTask } from './data-model';
import { AuthService } from './auth.service';
import { ITaskService } from './itask-service';

declare var gapi: any;
let gapi_data: Map<string, TaskList>;
let gapi_listIds = [] as string[];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements ITaskService {
  @Output() dataLoad: EventEmitter<any> = new EventEmitter();

  title = 'TaskAssist';
  gapi_client: any;

  constructor(private zone: NgZone, private meta: Meta, private authService: AuthService, private taskService: TaskService) {
    this.meta.addTag({ name: 'google-signin-client_id', content: AuthService.client_id });
    this.meta.addTag({ name: 'google-signin-scope', content: AuthService.scope });
    this.authService = authService;
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.signIn();
  }

  onDataLoad(): void {
    this.dataLoad.emit(null);
  }

  getTasks(): ITask[] {
    if (gapi_listIds != null && gapi_listIds.length > 0) {
      var taskList = this.getSelectedTaskList();
      return taskList.tasks;
    }
  }
  
  getSelectedTaskList(): ITaskList{
    return gapi_data[gapi_listIds[0]];
  }
  getTaskLists(): ITaskList[]{
    return Array.from( gapi_data.values() );
  }

  getTaskListIds(): string[]{
    return Array.from( gapi_data.keys() );
  }

  signIn() {
    gapi.load('client:auth2',  () => {
      var googleAuth = gapi.auth2.init({
        client_id: AuthService.client_id,
        scope: AuthService.scope
      }).then((response) => {
        console.log('Success initializing gapi.auth2.');
      }, function(errorHandler) {
        console.log('Error: ' + ((errorHandler == null || errorHandler.result == null) ? "undefined errorHandler" : errorHandler.result.error.message));
      });

      console.log("Wiring up auth events.");
      googleAuth.then(this.onGoogleAuthInit, this.onGoogleAuthError);
    });
  }

  onGoogleAuthInit() {
    // trigger googleAuthInitialized() with local scope
    window['onGoogleAuthInitialized'].click();
  }

  onGoogleAuthError(error:any){
    console.log("Error from GoogleAuth!");
    // TODO: Handle this case
    // https://developers.google.com/identity/sign-in/web/reference#gapiauth2clientconfig
  }

  googleAuthInitialized(){
    // Wire up listener to watch for sign-in state change
    gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
    
    // Handle the initial sign-in state.
    this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
  }

  updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      console.log("GoogleAuth: Status change, user IS signed in");
      this.onGoogleAuthIsSignedIn();
    } else {
      console.log("GoogleAuth: Status change, NOT signed in.");
    }
  }

  onGoogleAuthIsSignedIn() {
    // trigger googleAuthInitialized() with local scope
    window['onGoogleAuthIsSignedIn'].click();
  }

  googleAuthIsSignedIn() {
      this.loadGapiClient();
  }

  loadGapiClient() {
    console.log('Loading GAPI client.');    
    console.log("apiKey:" + AuthService.api_key);
    console.log("discoveryDocs:" + AuthService.discoveryDocs);
    console.log("clientId:" + AuthService.client_id);
    console.log("scope:" + AuthService.scope);
    gapi.client.init({
      apiKey: AuthService.api_key,
      discoveryDocs: AuthService.discoveryDocs,
      clientId: AuthService.client_id,
      scope: AuthService.scope
    }).then(function () {
      window['onGoogleGapiClientInitialized'].click();
    }, function(errorHandler) {
      console.log('Error: ' + ((errorHandler == null || errorHandler.result == null) ? "undefined errorHandler" : errorHandler.result.error.message));
    });
  }

  googleGapiClientInitialized() {
    this.BuildModel();
  }

  onSignOut() {
    // clear data
    gapi_data = null;
    gapi_listIds = null;

    // log out
    gapi.auth2.getAuthInstance().disconnect();
    gapi.auth2.getAuthInstance().signOut(
    ).then((response) => {
      console.log('Successful sign-out.');
      setTimeout(() => location.reload(), 1000);
    }, function(errorHandler) {
      console.log('Error: ' + ((errorHandler == null || errorHandler.result == null) ? "undefined errorHandler" : errorHandler.result.error.message));
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

  BuildModel() {

    // Initialize data package
    if (gapi_data != null) {
      return;
    }
    gapi_data = new Map<string, TaskList>(); 

    // Use the GAPI module to fetch data and build arrays
    // This is a mess because the GAPI object doesn't play nice with services
    console.log("Building the model...");

    // dig through task lists for data
    gapi.client.tasks.tasklists.list({
    }).then((response) => {
      var index: number;
      if (response.result == null || response.result.items == null || response.result.items.length == 0) {
        console.log('No Task Lists found.');
      } else {
        console.log('Found ' + response.result.items.length + ' Task LISTS.');
        var index: number;
        for (index = 0; index < response.result.items.length; index++) {
          gapi_listIds.push(response.result.items[index].id);
          gapi_data[response.result.items[index].id] =
                    new TaskList(response.result.items[index].id,
                    response.result.items[index].title);
          if (gapi_data[response.result.items[index].id].tasks == null){
            let taskArray = [] as RootTask[];
            gapi_data[response.result.items[index].id].tasks = taskArray;
          }
          console.log('Building list: ' + response.result.items[index].title);

          // move on from lists
          // parse tasks for data
          gapi.client.tasks.tasks.list( {tasklist: response.result.items[index].id }
          ).then((response) => {
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
                
                // Store callbacks against the correct list id
                var listId = response.result.items[index].selfLink;
                var firstPos = listId.indexOf("/tasks/v1/lists/");
                listId = listId.substring(firstPos + 16, listId.length);
                var secondPos = listId.indexOf("/tasks/");
                listId = listId.substring(0, secondPos);
                gapi_data[listId].tasks.push(task);
              }
            }   
          }), function(errorHandler) {
            console.log('Error: ' + ((errorHandler == null || errorHandler.result == null) ? "undefined errorHandler" : errorHandler.result.error.message));
          };
        }
        
        this.onDataLoad();
      }
    }), function(errorHandler) {
      console.log('Error: ' + ((errorHandler == null || errorHandler.result == null) ? "undefined errorHandler" : errorHandler.result.error.message));
    };
  }

}
