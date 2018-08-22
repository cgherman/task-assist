import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription, from, of, Subject } from 'rxjs';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

import { TaskServiceBase } from './task-service-base';
import { GapiWrapperService } from '../shared/gapi-wrapper.service';

import { ITask } from '../../models/task/itask';
import { ITaskList } from '../../models/task/itask-list';
import { TaskList } from '../../models/task/task-list';
import { TaskFactoryService } from '../../factories/task/task-factory-service';
import { ITasksInList } from '../../models/task/itasks-in-list';


@AutoUnsubscribe({includeArrays: true})
@Injectable({
  providedIn: 'root'
})

export class GoogleTaskService extends TaskServiceBase implements OnDestroy {  
  public errorLoadingTasks: Subject<any> = new Subject();
  public taskListsLoaded: Subject<ITaskList[]> = new Subject();
  public tasksLoaded: Subject<ITasksInList> = new Subject();

  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];

  // Our task factory
  private taskFactoryService: TaskFactoryService;

  constructor(private gapiWrapper: GapiWrapperService) {  
    super();
  }

  // ngOnDestroy needs to be present for @AutoUnsubscribe to function
  ngOnDestroy() {
  }

  public SetFactoryStrategy(taskFactoryService: TaskFactoryService) {
    this.taskFactoryService = taskFactoryService;
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
        this.errorLoadingTasks.next();
        reject(errorHandler);
      });

    });

    var callback: Function;
    callback = (taskLists => this.onTaskListsLoaded(taskLists));

    return this.makeObservable(myPromise, callback);
  }

  private onTaskListsLoaded(taskLists: ITaskList[]) {
    this.taskListsLoaded.next(taskLists);
  }

  public getTasks(taskList: any): Observable<ITask[]> {
    var myPromise: Promise<ITask[]>;

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
          var tasks: ITask[];
          tasks = this.taskFactoryService.CreateTaskArray(response);
          resolve(tasks);
        }
      }).catch((errorHandler) => {
        this.errorLoadingTasks.next();
        reject(errorHandler);
      });
    });
    
    var callback: Function;
    callback = (tasks => this.onTasksLoaded(this.taskFactoryService.CreateTasksInList(tasks, taskList)));

    return this.makeObservable(myPromise, callback);
  }

  // invoked with a taskEventContainer object
  private onTasksLoaded(tasksInList: ITasksInList) {
    this.tasksLoaded.next(tasksInList);
  }

  public getTask(taskId: string, taskListId: string): Observable<ITask> {
    var myPromise: Promise<ITask>;

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
          var task: ITask;
          task = this.taskFactoryService.CreateTask(response);
          resolve(task);
        }
      }).catch((errorHandler) => {
        this.errorLoadingTasks.next();
        reject(errorHandler);
      });
    });

    return this.makeObservable(myPromise);
  }

  public updateTask(task: ITask, taskListId: string): Promise<ITask> {
    var myPromise: Promise<ITask>;

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
          var task: ITask;
          task = this.taskFactoryService.CreateTask(response);
          resolve(task);
        }
      }).catch((errorHandler) => {
        this.errorLoadingTasks.next();
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
}