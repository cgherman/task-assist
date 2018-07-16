import { Injectable, Output, EventEmitter} from '@angular/core';
import { ITask } from './models/itask';
import { Task } from './models/task';
import { ITaskList } from './models/itask-list';
import { TaskList } from './models/task-list';
import { Observable, PartialObserver, of, from } from 'rxjs';
import { TaskServiceBase } from './task-service-base';

let _gapi_reference = null;

@Injectable({
  providedIn: 'root'
})

export class TaskService implements TaskServiceBase {  


  TaskService() {  
  }

  // Set reference to Google API
  public setGapiReference(gapi: any) {
    _gapi_reference = gapi;
  }

  private makeObservable<T>(promise: Promise<T>, observer?): Observable<T> {
    var myObservable: Observable<T>;

    myObservable = from(promise);
    if (observer != null) {
      myObservable.subscribe(observer);
    }

    return myObservable;
  }

  getTaskLists(observer?: PartialObserver<ITaskList[]>): Observable<ITaskList[]>{
    var myPromise: Promise<TaskList[]>;

    myPromise = new Promise((resolve, reject) => {
      if (_gapi_reference == null || _gapi_reference.client == null) {
        reject("GAPI client object is not fully initialized.");
      }

      // Use Google API to get task lists
      _gapi_reference.client.tasks.tasklists.list({
      }).then((response) => {
        if (response == null || response.result == null || response.result.items == null || response.result.items.length == 0) {
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

    return this.makeObservable(myPromise, observer);
  }

  getTasks(taskList: any): Observable<ITask[]> {
    var myPromise: Promise<Task[]>;

    myPromise = new Promise((resolve, reject) => {
      if (_gapi_reference == null || _gapi_reference.client == null) {
        reject("GAPI client object is not fully initialized.");
      }

      // Use Google API to get tasks
      _gapi_reference.client.tasks.tasks.list( { tasklist: taskList,
                                                 showCompleted: "false" 
      }).then((response) => {
        if (response == null || response.result == null || response.result.items == null || response.result.items.length == 0) {
          resolve(null);
        } else {
          var tasks: Task[];
          tasks = this.parseTasks(response);
          resolve(tasks);
        }
      }).catch((errorHandler) => {
        reject(errorHandler);
      });
    });

    return this.makeObservable(myPromise);
  }

  getTask(taskId: string): Observable<ITask> {
    var myPromise: Promise<Task>;

    myPromise = new Promise((resolve, reject) => {
      if (_gapi_reference == null || _gapi_reference.client == null) {
        reject("GAPI client object is not fully initialized.");
      }

      // Use Google API to get tasks
      _gapi_reference.client.tasks.tasks.get( { task: taskId,
                                                tasklist: "@default"
      }).then((response) => {
        if (response == null || response.result == null) {
          resolve(null);
        } else {
          var task: Task;
          task = this.parseTask(response);
          resolve(task);
        }
      }).catch((errorHandler) => {
        reject(errorHandler);
      });
    });

    return this.makeObservable(myPromise);
  }

  updateTask(task: ITask) {
    var myPromise: Promise<Task>;

    myPromise = new Promise((resolve, reject) => {
      if (_gapi_reference == null || _gapi_reference.client == null) {
        reject("GAPI client object is not fully initialized.");
      }

      // Use Google API to get tasks
      _gapi_reference.client.tasks.tasks.patch( { task: task.id,
                                                  tasklist: "@default",
                                                  notes: task.notes
      }).then((response) => {
        if (response == null || response.result == null) {
          resolve(null);
        } else {
          var task: Task;
          task = this.parseTask(response);
          resolve(task);
        }
      }).catch((errorHandler) => {
        reject(errorHandler);
      });
    });
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

  private parseTasks(response: any): Task[] {
    var index: number;
    var tasks = [] as Task[];

    for (index = 0; index < response.result.items.length; index++) {
      tasks.push(this.newTask(response.result.items[index]));
    }

    return tasks;
  }

  private parseTask(response: any): Task {
    return this.newTask(response.result);
  }

  // create a Task from a Google task Resource
  // https://developers.google.com/tasks/v1/reference/tasks#resource
  private newTask(taskResource: any): Task {
    return new Task(taskResource.id,
                    taskResource.title,
                    taskResource.selfLink,
                    taskResource.status,
                    taskResource.notes);
  }

}