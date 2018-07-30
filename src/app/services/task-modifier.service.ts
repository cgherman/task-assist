import { Injectable,Output, EventEmitter } from '@angular/core';
import { take } from 'rxjs/operators';
import { Subscription } from '../../../node_modules/rxjs';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

import { TaskModifierServiceBase } from './task-modifier-service-base';
import { ITask } from '../models/itask';
import { TaskServiceBase } from './task-service-base';

@AutoUnsubscribe({includeArrays: true})
@Injectable({
  providedIn: 'root'
})
export class TaskModifierService implements TaskModifierServiceBase {
  @Output() taskQuadrantUpdated: EventEmitter<any> = new EventEmitter();

  // these subscriptions will be cleaned up by @AutoUnsubscribe
  private subscriptions: Subscription[] = [];

  constructor() { }

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
    this.taskQuadrantUpdated.emit();
  }

  setQuadrant(task: ITask, quadrantChar: string) {
    var tagPositionStart = -1;
    var tagPositionEnd = -1;
    var newTaskNotes = "";

    if (task.notes != null && task.notes.length > 0) {
      tagPositionStart = task.notes.toUpperCase().indexOf("[QUAD");
    }

    // If tag was found then
    if (tagPositionStart >= 0) {
      // find end of tag
      tagPositionEnd = task.notes.toUpperCase().indexOf("]", tagPositionStart);

      // if characters exist left of tag then
      if (tagPositionStart > 0) {
        // capture prefix characters
        newTaskNotes = task.notes.substring(0, tagPositionStart - 1);
      }
    }
    else {
      // we will append a new tag to the existing notes
      newTaskNotes = (task.notes == null ? "" : task.notes + " ");
    }
    
    // add on new Quadrant identifier
    newTaskNotes += "[Quad:" + quadrantChar + "]"
    
    // add on suffix characters
    if (tagPositionEnd > 0 && tagPositionEnd < task.notes.length - 1) {
      newTaskNotes += task.notes.substring(tagPositionEnd + 1);
    }

    // replace old notes with new
    task.notes = newTaskNotes;
  }

  checkQuadrantMatch(task: ITask, quadrantChar:string): boolean {
    if (task.title == null || task.title.trim().length == 0) {
      // do not show "empty" tasks
      return false;
    }

    if (task == null || task.notes == null) {
      // declare match with "unspecified" quadrant
      return quadrantChar == null;
    } else {
      // match up specific quadrants
      if (quadrantChar == null) {
        return task.notes.includes("[Quad:0]") || !task.notes.includes("[Quad:");
      } else {
        return task.notes.includes("[Quad:" + quadrantChar + "]");
      }
    }
  }
}
