import { Injectable, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription, from, of } from 'rxjs';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

import { TaskServiceBase } from './task-service-base';
import { GapiWrapperService } from '../shared/gapi-wrapper.service';

import { IHashTable } from '../../models/shared/ihash-table';
import { ITask } from '../../models/task/itask';
import { Task } from '../../models/task/task';
import { ITaskList } from '../../models/task/itask-list';
import { TaskList } from '../../models/task/task-list';
import { TaskEventContainer } from '../../models/task/task-event-container';
import { TaskArrayEventContainer } from '../../models/task/task-array-event-container';


@AutoUnsubscribe({includeArrays: true})
@Injectable({
  providedIn: 'root'
})

export class TaskService implements TaskServiceBase, OnDestroy {  
  @Output() errorLoadingTasks: EventEmitter<any> = new EventEmitter();
  @Output() taskListsLoaded: EventEmitter<any> = new EventEmitter();
  @Output() tasksLoaded: EventEmitter<any> = new EventEmitter();

  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];

  private tasksCacheTable: IHashTable<ITask[]> = {}; 

  constructor(private gapiWrapper: GapiWrapperService) {  
  }

  // ngOnDestroy needs to be present for @AutoUnsubscribe to function
  ngOnDestroy() {
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

  public getTaskLists(): Observable<ITaskList[]> {
    var myPromise: Promise<TaskList[]>;

    myPromise = new Promise((resolve, reject) => {
      if (this.gapiWrapper.instance == null || this.gapiWrapper.instance.client == null) {
        reject("GAPI client object is not fully initialized.");
      }

      // Use Google API to get task lists
      this.gapiWrapper.instance.client.tasks.tasklists.list({
      }).then((response) => {
        if (response == null || response.result == null || response.result.items == null || response.result.items.length == 0) {
          resolve(null);
        } else {
          var taskLists: TaskList[];
          taskLists = this.parseTaskLists(response);
          resolve(taskLists);
        }
      }).catch((errorHandler) => {
        this.errorLoadingTasks.emit();
        reject(errorHandler);
      });

    });

    var callback: Function;
    callback = (taskLists => this.onTaskListsLoaded(taskLists));

    return this.makeObservable(myPromise, callback);
  }

  // $event: ITaskList[]
  private onTaskListsLoaded($event) {
    this.taskListsLoaded.emit($event);
  }

  public getTasks(taskList: any, cachedIsOkay?:boolean): Observable<ITask[]> {
    if (cachedIsOkay && this.tasksCacheTable[taskList] != null) {
      return this.getTasks_Cached(taskList);
    } else {
      return this.getTasks_Fresh(taskList);
    }
  }

  private getTasks_Cached(taskList: any): Observable<ITask[]> {
    var cachcedTasks = this.tasksCacheTable[taskList];
    if (cachcedTasks != null) {
      return Observable.create(observer => {
          observer.next(cachcedTasks);
          observer.complete();
      });
    } else {
      return null;
    }
  }

  private getTasks_Fresh(taskList: any): Observable<ITask[]> {
    var myPromise: Promise<Task[]>;

    myPromise = new Promise((resolve, reject) => {
      if (this.gapiWrapper.instance == null || this.gapiWrapper.instance.client == null) {
        reject("GAPI client object is not fully initialized.");
      }

      // Use Google API to get tasks
      this.gapiWrapper.instance.client.tasks.tasks.list( { tasklist: taskList,
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
        this.errorLoadingTasks.emit();
        reject(errorHandler);
      });
    });
    
    var callback: Function;
    callback = (tasks => this.onTasksLoaded(new TaskArrayEventContainer(tasks, taskList)));

    return this.makeObservable(myPromise, callback);
  }

  // invoked with a taskEventContainer object
  // $event: TaskArrayEventContainer
  private onTasksLoaded($event) {
    this.tasksLoaded.emit($event);
    this.tasksCacheTable[$event.taskListId] = $event.tasks;
  }

  public getTask(taskId: string, taskListId: string): Observable<ITask> {
    var myPromise: Promise<Task>;

    myPromise = new Promise((resolve, reject) => {
      if (this.gapiWrapper.instance == null || this.gapiWrapper.instance.client == null) {
        reject("GAPI client object is not fully initialized.");
      }

      // Use Google API to get tasks
      this.gapiWrapper.instance.client.tasks.tasks.get( { task: taskId,
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
        this.errorLoadingTasks.emit();
        reject(errorHandler);
      });
    });

    return this.makeObservable(myPromise);
  }

  public updateTask(task: ITask, taskListId: string, cachedIsOkay?:boolean): Promise<ITask> {
    var myPromise: Promise<Task>;

    var useCache = cachedIsOkay && this.tasksCacheTable[taskListId] != null;

    myPromise = new Promise((resolve, reject) => {
      if (this.gapiWrapper.instance == null || this.gapiWrapper.instance.client == null) {
        reject("GAPI client object is not fully initialized.");
      }

      // Use Google API to get tasks
      this.gapiWrapper.instance.client.tasks.tasks.patch( { task: task.id,
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
        this.errorLoadingTasks.emit();
        reject(errorHandler);
      });
    });

    // set up callback based on caching choice
    if (useCache) {
      // update cache right now
      var taskEventContainer: TaskEventContainer = new TaskEventContainer(task, taskListId);
      this.updateCache(taskEventContainer);
    } else {
      // internal callback so we can update the cache
      var callback: Function;
      callback = (task => this.onTaskUpdated(new TaskEventContainer(task, taskListId)));
      this.makeObservable(myPromise, callback);
    }

    // set up return content based on caching choice
    if (useCache) {
      return new Promise<ITask>((resolve, reject) => {
        resolve(task);
      });
    } else {
      return myPromise;
    }
  }

  // $event: TaskEventContainer
  private onTaskUpdated($event) {
    this.updateCache($event);
  }

  private updateCache(taskEventContainer: TaskEventContainer) {
    var cachcedTasks = this.tasksCacheTable[taskEventContainer.taskListId];
    if (cachcedTasks != null) {
      var index = cachcedTasks.findIndex(cachedTask => cachedTask.id == taskEventContainer.task.id);
      if (index >= 0) {
        cachcedTasks[index] = taskEventContainer.task;
      }
    }
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