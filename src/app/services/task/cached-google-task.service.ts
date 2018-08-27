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
  public errorLoading: Subject<string> = new Subject();
  public errorSaving: Subject<string> = new Subject();
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

    var sub = this.googleTaskService.errorLoading.subscribe(errorMessage => this.onErrorLoading(errorMessage));
    this.subscriptions.push(sub); // capture for destruction

    var sub = this.googleTaskService.errorSaving.subscribe(errorMessage => this.onErrorSaving(errorMessage));
    this.subscriptions.push(sub); // capture for destruction

    var sub = this.googleTaskService.taskListsLoaded.subscribe(taskLists => this.onTaskListsLoaded(taskLists));
    this.subscriptions.push(sub); // capture for destruction

    var sub = this.googleTaskService.tasksLoaded.subscribe(tasksInList => this.onTasksLoaded(tasksInList));
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
  
  private onErrorLoading(errorMessage: string) {
    this.errorLoading.next(errorMessage);
  }

  private onErrorSaving(errorMessage: string) {
    this.errorSaving.next(errorMessage);
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
    var promise: Promise<ITask> = this.googleTaskService.updateTask(task, taskListId);
    return this.createUpdatePromise(taskListId, promise, (taskInList: ITaskInList)=>{this.onTaskUpdated(taskInList);});
  }

  private onTaskUpdated(taskInList: ITaskInList) {
    // TODO: emit here if desired
  }

  public updateTaskQuadrant(taskId: string, taskListId: string, newQuadrant: Quadrant): Promise<ITask> {
    return this.updateTaskQuadrantByChar(taskId, taskListId, newQuadrant.selection);
  }

  public updateTaskQuadrantByChar(taskId: string, taskListId: string, newQuadrantChar: string): Promise<ITask> {
    var promise: Promise<ITask> = this.googleTaskService.updateTaskQuadrantByChar(taskId, taskListId, newQuadrantChar);
    return this.createUpdatePromise(taskListId, promise, (taskInList: ITaskInList)=>{this.onTaskQuadrantUpdated(taskInList);});
  }

  private onTaskQuadrantUpdated(taskInList: ITaskInList) {
    this.taskQuadrantUpdated.next(taskInList);
  }
  
  private createUpdatePromise(taskListId: string, func: Promise<ITask>, callbackOnUpdate: (taskInList: ITaskInList)=>void ) {
    var myPromise: Promise<ITask>;
    var useCache = this.tasksCacheTable[taskListId] != null;

    myPromise = new Promise((resolve, reject) => {

      // call service
      func.then((updatedTask) => {
        if (updatedTask == null) {
          resolve(null);
        } else {
          var taskInList: ITaskInList = this.googleTaskBuilderService.createTaskInList(updatedTask, taskListId);

          if (useCache) {         
            this.updateCache(taskInList);
          }

          callbackOnUpdate(taskInList);
          resolve(taskInList.task);
        }
      }).catch((errorHandler) => {
        var errorMessage: string = (errorHandler == null || errorHandler.result == null || errorHandler.result.error == null) ? null : errorHandler.result.error.message;
        console.log('Error in CachedGoogleTaskService.createUpdatePromise: ' + (errorMessage == null ? "unknown" : errorMessage));
        this.errorLoading.next(errorMessage);
        reject(errorHandler);
      });
    });

    return myPromise;
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
}