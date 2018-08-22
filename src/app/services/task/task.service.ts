import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription, from, of, Subject } from 'rxjs';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

import { TaskServiceBase } from './task-service-base';

import { GoogleTaskService } from './google-task.service';
import { TaskFactoryService } from '../../factories/task/task-factory-service';
import { FlatTaskListFactory } from '../../factories/task/flat-task-list-factory';
import { FlatTaskFactory } from '../../factories/task/flat-task-factory';
import { IHashTable } from '../../models/shared/ihash-table';
import { ITask } from '../../models/task/itask';
import { ITaskList } from '../../models/task/itask-list';
import { ITasksInList } from '../../models/task/itasks-in-list';
import { ITaskInList } from '../../models/task/itask-in-list';


@AutoUnsubscribe({includeArrays: true})
@Injectable({
  providedIn: 'root'
})

export class TaskService extends TaskServiceBase implements OnDestroy {  
  public errorLoadingTasks: Subject<any> = new Subject();
  public taskListsLoaded: Subject<ITaskList[]> = new Subject();
  public tasksLoaded: Subject<ITasksInList> = new Subject();

  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];

  private tasksCacheTable: IHashTable<ITask[]> = {};
  private taskFactoryService: TaskFactoryService;

  constructor(private googleTaskServiceService: GoogleTaskService) {  
    super();

    // TODO: parameterize factory/service
    this.taskFactoryService = new TaskFactoryService(new FlatTaskFactory(), new FlatTaskListFactory());
    googleTaskServiceService.SetFactoryStrategy(this.taskFactoryService);

    var sub = this.googleTaskServiceService.errorLoadingTasks.subscribe(item => this.onErrorLoadingTasks());
    this.subscriptions.push(sub); // capture for destruction

    var sub = this.googleTaskServiceService.taskListsLoaded.subscribe(taskLists => this.onTaskListsLoaded(taskLists));
    this.subscriptions.push(sub); // capture for destruction

    var sub = this.googleTaskServiceService.tasksLoaded.subscribe(tasksInList => this.onTasksLoaded(tasksInList));
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
      this.updateCache(this.taskFactoryService.CreateTaskInList(task, taskListId));
    } else {
      // internal callback so we can update the cache
      var callback: Function;
      callback = (task => this.onTaskUpdated(this.taskFactoryService.CreateTaskInList(task, taskListId)));
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

  private onTaskUpdated(taskEventContainer: ITaskInList) {
    this.updateCache(taskEventContainer);
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