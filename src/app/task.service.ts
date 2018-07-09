import { Injectable, Output, EventEmitter} from '@angular/core';
import { ITaskList, TaskList, ITask, RootTask, SubTask } from './data-model';
import { Observable, of, from } from 'rxjs';

let gapi_tasks: Function;
let gapi_tasklists: Function;

@Injectable({
  providedIn: 'root'
})

export class TaskService {
  @Output() providersSet: EventEmitter<any> = new EventEmitter();
  
  TaskService() {  
  }

  private onProvidersSet(): void {
    this.providersSet.emit(null);
  }

  setProviders(gapi_client_tasks_tasklists_list: Function, gapi_client_tasks_tasks_list: Function) {
    gapi_tasklists = gapi_client_tasks_tasklists_list;
    gapi_tasks = gapi_client_tasks_tasks_list;
    this.onProvidersSet();
  }

  getTaskLists(subscriber?): Observable<TaskList[]>{
    var observable: Observable<TaskList[]>
    var promise: Promise<TaskList[]>;

    promise = new Promise((resolve, reject) => {
      if (gapi_tasklists == null) {
        reject("GAPI client object is not fully initialized.");
      }

      // Use Google API to get task lists
      gapi_tasklists({
      }).then((response) => {
        if (response.result == null || response.result.items == null || response.result.items.length == 0) {
          resolve(null);
        } else {
          var taskLists: TaskList[];
          taskLists = this.parseTaskLists(response);
          resolve(taskLists);
        }
      }).catch((errorHandler) => {
        reject(errorHandler);
      });

    });

    observable = from(promise);
    if (subscriber != null) {
      observable.subscribe(subscriber);
    }
    
    return observable
  }

  getTasks(taskList: any): Observable<RootTask[]> {
    var observable: Observable<RootTask[]>
    var promise: Promise<RootTask[]>;

    promise = new Promise((resolve, reject) => {
      if (gapi_tasks == null) {
        reject("GAPI client object is not fully initialized.");
      }

      // Use Google API to get tasks
      gapi_tasks( {tasklist: taskList,
                   showCompleted: "false" 
      }).then((response) => {
        if (response.result == null || response.result.items == null || response.result.items.length == 0) {
          resolve(null);
        } else {
          var tasks: RootTask[];
          tasks = this.parseTasks(response);
          resolve(tasks);
        }
      }).catch((errorHandler) => {
        reject(errorHandler);
      });

    });

    observable = from(promise);
    return from(observable);
  }

  private parseTaskLists(response: any): TaskList[] {
    var index: number;
    var taskLists = [] as TaskList[];
    
    if (response.result == null || response.result.items == null || response.result.items.length == 0) {
      console.log('No Task Lists found.');
      return null;
    } else {
      console.log('Found ' + response.result.items.length + ' Task LISTS.');

      var index: number;
      var task;
      for (index = 0; index < response.result.items.length; index++) {
        task = new TaskList(response.result.items[index].id,
                            response.result.items[index].title);
        taskLists.push(task);
      }

      return taskLists;
    }
  }

  private parseTasks(response: any): RootTask[] {
    var index: number;
    var tasks = [] as RootTask[];

    for (index = 0; index < response.result.items.length; index++) {
      var task = new RootTask(response.result.items[index].id,
                              response.result.items[index].title,
                              response.result.items[index].selfLink,
                              response.result.items[index].status,
                              response.result.items[index].notes);

      tasks.push(task);
    }

    return tasks;
  }

}