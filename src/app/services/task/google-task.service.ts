import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription, from, of, Subject, pipe } from 'rxjs';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

import { QuadTaskServiceBase } from './quad-task-service-base';
import { GapiWrapperService } from '../shared/gapi-wrapper.service';

import { ITask } from '../../models/task/itask';
import { ITaskList } from '../../models/task/itask-list';
import { ITasksInList } from '../../models/task/itasks-in-list';
import { GoogleTaskBuilderService } from './google-task-builder.service';
import { Quadrant } from '../../models/task/quadrant';
import { ITaskInListWithState } from '../../models/task/itask-in-list-with-state';
import { DataState } from '../../models/task/data-state.enum';


@AutoUnsubscribe({includeArrays: true})
@Injectable({
  providedIn: 'root'
})

export class GoogleTaskService extends QuadTaskServiceBase implements OnDestroy {  
  public errorLoading: Subject<string> = new Subject();
  public errorSaving: Subject<string> = new Subject();
  public taskListsLoaded: Subject<ITaskList[]> = new Subject();
  public tasksLoaded: Subject<ITasksInList> = new Subject();
  public taskQuadrantDataEvent: Subject<ITaskInListWithState> = new Subject();

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
        var errorMessage: string = (errorHandler == null || errorHandler.result == null || errorHandler.result.error == null) ? null : errorHandler.result.error.message;
        console.log('Error in GoogleTaskService.getTaskLists: ' + (errorMessage == null ? "unknown" : errorMessage));
        this.errorLoading.next(errorMessage);
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

  public getTasks(taskListId: string): Observable<ITask[]> {
    var myPromise: Promise<ITask[]>;

    myPromise = new Promise((resolve, reject) => {
      if (this.gapiWrapper.instance == null || this.gapiWrapper.instance.client == null) {
        reject("GAPI client object is not fully initialized.");
      }

      // Use Google API to get tasks
      this.gapiWrapper.instance.client.tasks.tasks.list( { tasklist: taskListId,
                                                 showCompleted: "false" 
      }).then((response) => {
        if (response == null || response.result == null || response.result.items == null || response.result.items.length == 0) {
          resolve(null);
        } else {
          var tasks: ITask[] = this.googleTaskBuilderService.createTaskArray(response);
          resolve(tasks);
        }
      }).catch((errorHandler) => {
        var errorMessage: string = (errorHandler == null || errorHandler.result == null || errorHandler.result.error == null) ? null : errorHandler.result.error.message;
        console.log('Error in GoogleTaskService.getTasks: ' + (errorMessage == null ? "unknown" : errorMessage));
        this.errorLoading.next(errorMessage);
        reject(errorHandler);
      });
    });
    
    var callback: Function;
    callback = (tasks => this.onTasksLoaded(this.googleTaskBuilderService.createTasksInList(tasks, taskListId)));

    return this.makeObservable(myPromise, callback);
  }

  // invoked with a taskEventContainer object
  private onTasksLoaded(tasksInList: ITasksInList) {
    this.tasksLoaded.next(tasksInList);
  }

  public getTask(taskId: string, taskListId: string): Observable<ITask> {
    return this.makeObservable(this.getTaskPromise(taskId, taskListId));
  }

  private getTaskPromise(taskId: string, taskListId: string): Promise<ITask> {
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
        var errorMessage: string = (errorHandler == null || errorHandler.result == null || errorHandler.result.error == null) ? null : errorHandler.result.error.message;
        console.log('Error in GoogleTaskService.getTaskPromise: ' + (errorMessage == null ? "unknown" : errorMessage));
        this.errorLoading.next(errorMessage);
        reject(errorHandler);
      });
    });

    return myPromise;
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
        var errorMessage: string = (errorHandler == null || errorHandler.result == null || errorHandler.result.error == null) ? null : errorHandler.result.error.message;
        console.log('Error in GoogleTaskService.updateTask: ' + (errorMessage == null ? "unknown" : errorMessage));
        this.errorSaving.next(errorMessage);
        reject(errorHandler);
      });
    });

    return myPromise;
  }

  public updateTaskQuadrant(taskId: string, taskListId: string, newQuadrant: Quadrant): Promise<ITask> {
    return this.updateTaskQuadrantByChar(taskId, taskListId, newQuadrant.selection);
  }

  public updateTaskQuadrantByChar(taskId: string, taskListId: string, newQuadrantChar: string): Promise<ITask> {
    var myPromise: Promise<ITask>;

    myPromise = new Promise((resolve, reject) => {

      // Use Google API to get tasks
      this.getTaskPromise(taskId, taskListId
      ).then((task) => {
        if (task == null) {
          resolve(null);
        } else {
          // Using fresh task, update quadrant so we can save up-to-date info
          this.googleTaskBuilderService.decodeRawNotesForQuadTask(task);
          this.googleTaskBuilderService.setQuadrantForQuadTask(task, newQuadrantChar);
          this.googleTaskBuilderService.encodeRawNotesForQuadTask(task);

          // notify of desire to update so UI can update early if desired
          var taskInListEarly: ITaskInListWithState = this.googleTaskBuilderService.createTaskInListWithState(task, taskListId, DataState.Preparing);
          this.onTaskQuadrantDataEvent(taskInListEarly);

          // Commit updated task notes via Google API
          this.updateTask(task, taskListId
          ).then((updatedTask) => {
            console.log("Task " + updatedTask.id + " successfully updated via API.");
            var taskInListCommitted: ITaskInListWithState = this.googleTaskBuilderService.createTaskInListWithState(updatedTask, taskListId, DataState.Committed);
            this.onTaskQuadrantDataEvent(taskInListCommitted);
            resolve(taskInListCommitted.task);
          }).catch((errorHandler) => {
            var errorMessage: string = (errorHandler == null || errorHandler.result == null || errorHandler.result.error == null) ? null : errorHandler.result.error.message;
            console.log('Error in updateTaskQuadrantByChar.updateTaskQuadrantByChar: ' + (errorMessage == null ? "unknown" : errorMessage));
            this.errorSaving.next(errorMessage);
            reject(errorHandler);
          });
        }
      }).catch((errorHandler) => {
        var errorMessage: string = (errorHandler == null || errorHandler.result == null || errorHandler.result.error == null) ? null : errorHandler.result.error.message;
        console.log('Error in GoogleTaskService.updateTaskQuadrantByChar: ' + (errorMessage == null ? "unknown" : errorMessage));
        this.errorSaving.next(errorMessage);
        reject(errorHandler);
      });
    });

    return myPromise;
  }

  private onTaskQuadrantDataEvent(taskInListWithState: ITaskInListWithState) {
    this.taskQuadrantDataEvent.next(taskInListWithState);
  }
}