import { Injectable, OnDestroy } from '@angular/core';
import { take } from 'rxjs/operators';
import { Subscription, Subject } from 'rxjs';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

import { TaskModifierServiceBase } from './task-modifier-service-base';
import { ITask } from '../../models/task/itask';
import { TaskServiceBase } from './task-service-base';
import { TaskConverter } from '../../factories/task/task-converter';

@AutoUnsubscribe({includeArrays: true})
@Injectable({
  providedIn: 'root'
})
export class TaskModifierService implements TaskModifierServiceBase, OnDestroy {
  public taskQuadrantUpdated: Subject<any> = new Subject();

  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];

  private taskConverter: TaskConverter;

  constructor() { 
    this.taskConverter = new TaskConverter();
  }

  // ngOnDestroy needs to be present for @AutoUnsubscribe to function
  ngOnDestroy() {
  }
  
  updateTaskQuadrant(taskService: TaskServiceBase, taskId: string, taskListId: string, quadrantChar: string) {
    var sub: Subscription;

    // get fresh task to work upon
    sub = taskService.getTask(taskId, taskListId)
    .pipe(take(1))
    .subscribe((task: ITask) => 
      {
        // Update notes of fresh task
        this.setQuadrant(task, quadrantChar);

        // Commit updated task notes via Google API
        taskService.updateTask( task, taskListId
        ).then((task) => {
          console.log("Task " + task.id + " successfully updated via API.");
          this.onTaskQuadrantUpdated();
        }).catch((errorHandler) => {
          console.log('Error in QuadrantComponent.onDrop: UpdateTask: ' + ((errorHandler == null || errorHandler.result == null) ? "undefined errorHandler" : errorHandler.result.error.message));
        });
      }
    );
    this.subscriptions.push(sub); // capture for destruction
  }

  private onTaskQuadrantUpdated() {
    this.taskQuadrantUpdated.next();
  }

  setQuadrant(task: ITask, quadrantChar: string) {    
    this.taskConverter.decodeRawNotesForQuadTask(task);

    this.taskConverter.setQuadrantForQuadTask(task, quadrantChar);

    this.taskConverter.encodeRawNotesForQuadTask(task);    
  }

  
}
