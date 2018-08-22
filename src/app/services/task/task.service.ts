import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription, from, of, Subject } from 'rxjs';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

import { TaskServiceBase } from './task-service-base';

import { IHashTable } from '../../models/shared/ihash-table';
import { ITask } from '../../models/task/itask';
import { ITaskList } from '../../models/task/itask-list';
import { TaskEventContainer } from '../../models/task/task-event-container';
import { GoogleTaskServiceService } from './google-task-service.service';
import { TaskArrayEventContainer } from '../../models/task/task-array-event-container';


@AutoUnsubscribe({includeArrays: true})
@Injectable({
  providedIn: 'root'
})

export class TaskService extends TaskServiceBase implements OnDestroy {  
  public errorLoadingTasks: Subject<any> = new Subject();
  public taskListsLoaded: Subject<ITaskList[]> = new Subject();
  public tasksLoaded: Subject<TaskArrayEventContainer> = new Subject();

  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];

  private tasksCacheTable: IHashTable<ITask[]> = {};

  constructor(private googleTaskServiceService: GoogleTaskServiceService) {  
    super();

    var sub = this.googleTaskServiceService.errorLoadingTasks.subscribe(item => this.onErrorLoadingTasks());
    this.subscriptions.push(sub); // capture for destruction

    var sub = this.googleTaskServiceService.taskListsLoaded.subscribe(taskLists => this.onTaskListsLoaded(taskLists));
    this.subscriptions.push(sub); // capture for destruction

    var sub = this.googleTaskServiceService.tasksLoaded.subscribe(taskArrayEventContainer => this.onTasksLoaded(taskArrayEventContainer));
    this.subscriptions.push(sub); // capture for destruction
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
  
  private onErrorLoadingTasks() {
    this.errorLoadingTasks.next();
  }

  private onTaskListsLoaded(taskLists: ITaskList[]) {
    this.taskListsLoaded.next(taskLists);
  }

  private onTasksLoaded(taskArrayEventContainer: TaskArrayEventContainer) {
    this.tasksLoaded.next(taskArrayEventContainer);
    this.tasksCacheTable[taskArrayEventContainer.taskListId] = taskArrayEventContainer.tasks;
  }

  public getTaskLists(): Observable<ITaskList[]> {
    return this.googleTaskServiceService.getTaskLists();
  }

  public getTasks(taskList: any, preferFreshData: boolean = false): Observable<ITask[]> {
    if (!preferFreshData && this.tasksCacheTable[taskList] != null) {
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
    return this.googleTaskServiceService.getTasks(taskList);
  }

  public getTask(taskId: string, taskListId: string): Observable<ITask> {
    return this.googleTaskServiceService.getTask(taskId, taskListId);
  }

  public updateTask(task: ITask, taskListId: string): Promise<ITask> {
    var myPromise: Promise<ITask>;
    var useCache = this.tasksCacheTable[taskListId] != null;

    myPromise = this.googleTaskServiceService.updateTask(task, taskListId);

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

  private onTaskUpdated(taskEventContainer: TaskEventContainer) {
    this.updateCache(taskEventContainer);
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

}