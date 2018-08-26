import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription, from, of, Subject } from 'rxjs';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

import { QuadTaskServiceBase } from './quad-task-service-base';

import { GoogleTaskService } from './google-task.service';
import { IHashTable } from '../../models/shared/ihash-table';
import { ITask } from '../../models/task/itask';
import { ITaskList } from '../../models/task/itask-list';
import { ITasksInList } from '../../models/task/itasks-in-list';
import { ITaskInList } from '../../models/task/itask-in-list';
import { GoogleTaskBuilderService } from './google-task-builder.service';
import { Quadrant } from '../../models/task/quadrant';

@AutoUnsubscribe({includeArrays: true})
@Injectable({
  providedIn: 'root'
})

export class CachedGoogleTaskService extends QuadTaskServiceBase implements OnDestroy {  
  public errorLoadingTasks: Subject<any> = new Subject();
  public taskListsLoaded: Subject<ITaskList[]> = new Subject();
  public tasksLoaded: Subject<ITasksInList> = new Subject();
  public taskQuadrantUpdated: Subject<ITaskInList> = new Subject();

  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];

  private tasksCacheTable: IHashTable<ITask[]> = {};

  constructor(private googleTaskService: GoogleTaskService,
              private googleTaskBuilderService: GoogleTaskBuilderService
             ) {  
    super();

    var sub = this.googleTaskService.errorLoadingTasks.subscribe(item => this.onErrorLoadingTasks());
    this.subscriptions.push(sub); // capture for destruction

    var sub = this.googleTaskService.taskListsLoaded.subscribe(taskLists => this.onTaskListsLoaded(taskLists));
    this.subscriptions.push(sub); // capture for destruction

    var sub = this.googleTaskService.tasksLoaded.subscribe(tasksInList => this.onTasksLoaded(tasksInList));
    this.subscriptions.push(sub); // capture for destruction

    var sub = this.googleTaskService.taskQuadrantUpdated.subscribe(taskInList => this.onTaskQuadrantUpdated(taskInList));
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

  private onTasksLoaded(taskArrayEventContainer: ITasksInList) {
    this.tasksLoaded.next(taskArrayEventContainer);
    this.tasksCacheTable[taskArrayEventContainer.taskListId] = taskArrayEventContainer.tasks;
  }

  public getTaskLists(): Observable<ITaskList[]> {
    return this.googleTaskService.getTaskLists();
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
    return this.googleTaskService.getTasks(taskList);
  }

  public getTask(taskId: string, taskListId: string): Observable<ITask> {
    return this.googleTaskService.getTask(taskId, taskListId);
  }

  public updateTask(task: ITask, taskListId: string): Promise<ITask> {
    var myPromise: Promise<ITask>;
    var useCache = this.tasksCacheTable[taskListId] != null;

    // POSSIBLE ISSUE: Subscribers of the promise MAY get old data, b/c onTaskUpdated may fire AFTER the promise
    // TODO: create new promise that calls google and resolves cache before resolving for consumer
    myPromise = this.googleTaskService.updateTask(task, taskListId);

    // set up callback based on caching choice
    if (useCache) {
      // update cache right now
      var taskInList: ITaskInList = this.googleTaskBuilderService.createTaskInList(task, taskListId);
      this.updateCache(taskInList);
    } else {
      // internal callback so we can update the cache
      var callback: Function;
      callback = (task => this.onTaskUpdated(this.googleTaskBuilderService.createTaskInList(task, taskListId)));
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

  private onTaskUpdated(taskInList: ITaskInList) {    
    this.updateCache(taskInList);
  }

  private updateCache(taskEventContainer: ITaskInList) {
    var cachcedTasks = this.tasksCacheTable[taskEventContainer.taskListId];
    if (cachcedTasks != null) {
      var index = cachcedTasks.findIndex(cachedTask => cachedTask.id == taskEventContainer.task.id);
      if (index >= 0) {
        cachcedTasks[index] = taskEventContainer.task;
      }
    }
  }

  public updateTaskQuadrant(taskId: string, taskListId: string, newQuadrant: Quadrant) {
    this.googleTaskService.updateTaskQuadrant(taskId, taskListId, newQuadrant);

     // TODO: return an observer/promise from this method that resolves after the cache has been updated
  }

  public updateTaskQuadrantByChar(taskId: string, taskListId: string, newQuadrantChar: string) {
    this.googleTaskService.updateTaskQuadrantByChar(taskId, taskListId, newQuadrantChar);

     // TODO: return an observer/promise from this method that resolves after the cache has been updated
  }

  private onTaskQuadrantUpdated(taskInList: ITaskInList) {
    // TODO: make this process consistent with onTaskUpdated process; 
    this.updateCache(taskInList);
    this.taskQuadrantUpdated.next(taskInList);
  }
}