import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription, from } from 'rxjs';
import { TaskServiceBase } from './task-service-base';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

import { ITask } from './models/itask';
import { Task } from './models/task';
import { ITaskList } from './models/itask-list';
import { TaskList } from './models/task-list';

let _gapiReference = null;

@AutoUnsubscribe({includeArrays: true})
@Injectable({
  providedIn: 'root'
})

export class TaskService implements TaskServiceBase, OnDestroy {  

  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];

  TaskService() {  
  }

  // ngOnDestroy needs to be present for @AutoUnsubscribe to function
  ngOnDestroy() {
  }  

  // Set reference to Google API
  public setGapiReference(gapi: any) {
    _gapiReference = gapi;
  }

  private makeObservable<T>(promise: Promise<T>, observer?): Observable<T> {
    var myObservable: Observable<T>;

    myObservable = from(promise);
    if (observer != null) {
      var sub = myObservable.subscribe(observer);
      this.subscriptions.push(sub); // capture for destruction
    }

    return myObservable;
  }

  getTaskLists(subscriber?: any): Observable<ITaskList[]> {
    var myPromise: Promise<TaskList[]>;

    myPromise = new Promise((resolve, reject) => {
      if (_gapiReference == null || _gapiReference.client == null) {
        reject("GAPI client object is not fully initialized.");
      }

      // Use Google API to get task lists
      _gapiReference.client.tasks.tasklists.list({
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

    return this.makeObservable(myPromise, subscriber);
  }

  getTasks(taskList: any): Observable<ITask[]> {
    var myPromise: Promise<Task[]>;

    myPromise = new Promise((resolve, reject) => {
      if (_gapiReference == null || _gapiReference.client == null) {
        reject("GAPI client object is not fully initialized.");
      }

      // Use Google API to get tasks
      _gapiReference.client.tasks.tasks.list( { tasklist: taskList,
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

  getTask(taskId: string, taskListId: string): Observable<ITask> {
    var myPromise: Promise<Task>;

    myPromise = new Promise((resolve, reject) => {
      if (_gapiReference == null || _gapiReference.client == null) {
        reject("GAPI client object is not fully initialized.");
      }

      // Use Google API to get tasks
      _gapiReference.client.tasks.tasks.get( { task: taskId,
                                                tasklist: taskListId
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

  updateTask(task: ITask, taskListId: string): Promise<ITask> {
    var myPromise: Promise<Task>;

    myPromise = new Promise((resolve, reject) => {
      if (_gapiReference == null || _gapiReference.client == null) {
        reject("GAPI client object is not fully initialized.");
      }

      // Use Google API to get tasks
      _gapiReference.client.tasks.tasks.patch( { task: task.id,
                                                  tasklist: taskListId,
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

    return myPromise;
  }

  private parseTaskLists(response: any): TaskList[] {
    var index: number;
    var taskLists = [] as TaskList[];
    
    if (response.result == null || response.result.items == null || response.result.items.length == 0) {
      console.log('No Task Lists found.');
      return null;
    } else {
      console.log('Found ' + response.result.items.length + ' Task LISTS.');

      var task;
      for (var index = 0; index < response.result.items.length; index++) {
        task = new TaskList(response.result.items[index].id,
                            response.result.items[index].title);
        taskLists.push(task);
      }

      return taskLists;
    }
  }

  private parseTasks(response: any): Task[] {
    var tasks = [] as Task[];

    for (var index = 0; index < response.result.items.length; index++) {
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