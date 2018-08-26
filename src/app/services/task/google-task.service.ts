import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription, from, of, Subject } from 'rxjs';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

import { QuadTaskServiceBase } from './quad-task-service-base';
import { GapiWrapperService } from '../shared/gapi-wrapper.service';

import { ITask } from '../../models/task/itask';
import { ITaskList } from '../../models/task/itask-list';
import { ITasksInList } from '../../models/task/itasks-in-list';
import { GoogleTaskBuilderService } from './google-task-builder.service';
import { take } from 'rxjs/operators';
import { ITaskInList } from '../../models/task/itask-in-list';
import { Quadrant } from '../../models/task/quadrant';


@AutoUnsubscribe({includeArrays: true})
@Injectable({
  providedIn: 'root'
})

export class GoogleTaskService extends QuadTaskServiceBase implements OnDestroy {  
  public errorLoadingTasks: Subject<any> = new Subject();
  public taskListsLoaded: Subject<ITaskList[]> = new Subject();
  public tasksLoaded: Subject<ITasksInList> = new Subject();
  public taskQuadrantUpdated: Subject<ITaskInList> = new Subject();

  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];

  constructor(private gapiWrapper: GapiWrapperService,
              private googleTaskBuilderService: GoogleTaskBuilderService) {  
    super();
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
    var myPromise: Promise<ITaskList[]>;

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
          resolve(this.googleTaskBuilderService.createTaskLists(response));
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
          resolve(this.googleTaskBuilderService.createTaskArray(response));
        }
      }).catch((errorHandler) => {
        this.errorLoadingTasks.next();
        reject(errorHandler);
      });
    });
    
    var callback: Function;
    callback = (tasks => this.onTasksLoaded(this.googleTaskBuilderService.createTasksInList(tasks, taskList)));

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
          var task: ITask = this.googleTaskBuilderService.createTask(response);
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
          resolve(this.googleTaskBuilderService.createTask(response));
        }
      }).catch((errorHandler) => {
        this.errorLoadingTasks.next();
        reject(errorHandler);
      });
    });

    return myPromise;
  }

  public updateTaskQuadrant(taskId: string, taskListId: string, newQuadrant: Quadrant) {
    this.updateTaskQuadrantByChar(taskId, taskListId, newQuadrant.selection);
  }

  public updateTaskQuadrantByChar(taskId: string, taskListId: string, newQuadrantChar: string) {
    var sub: Subscription;

    // get fresh task to work upon
    sub = this.getTask(taskId, taskListId)
    .pipe(take(1))
    .subscribe((task: ITask) => 
      {
        // Using fresh task, update quadrant so we can save up-to-date info
        this.googleTaskBuilderService.decodeRawNotesForQuadTask(task);
        this.googleTaskBuilderService.setQuadrantForQuadTask(task, newQuadrantChar);
        this.googleTaskBuilderService.encodeRawNotesForQuadTask(task);    

        // Commit updated task notes via Google API
        this.updateTask( task, taskListId
        ).then((task) => {
          console.log("Task " + task.id + " successfully updated via API.");
          this.onTaskQuadrantUpdated(this.googleTaskBuilderService.createTaskInList(task, taskListId));
        }).catch((errorHandler) => {
          console.log('Error in QuadrantComponent.onDrop: UpdateTask: ' + ((errorHandler == null || errorHandler.result == null) ? "undefined errorHandler" : errorHandler.result.error.message));
        });
      }
    );
    this.subscriptions.push(sub); // capture for destruction

    // TODO: return an observer/promise from this method; call this.onTaskQuadrantUpdated after that resolves 
  }

  private onTaskQuadrantUpdated(taskInList: ITaskInList) {
    this.taskQuadrantUpdated.next(taskInList);
  }
}