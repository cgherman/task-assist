import { Injectable } from '@angular/core';
import { TaskModifierServiceBase } from './task-modifier-service-base';
import { ITask } from './models/itask';

@Injectable({
  providedIn: 'root'
})
export class TaskModifierService implements TaskModifierServiceBase {

  constructor() { }

  setQuadrant(task: ITask, targetQuadrant: string) {
    var tagPositionStart = task.notes.toUpperCase().indexOf("[QUAD");
    var tagPositionEnd = -1;
    var newTaskNotes;

    // generate new prefix
    if (tagPositionStart >= 0) {
      tagPositionEnd = task.notes.toUpperCase().indexOf("]", tagPositionStart);

      if (tagPositionStart > 0) {
        newTaskNotes = task.notes.substring(0, tagPositionStart - 1);
      }
      else {
        newTaskNotes = "";
      }
    }
    else {
      newTaskNotes = task.notes + " ";
    }
    
    // add on new Quadrant identifier
    newTaskNotes += "[Quad:" + targetQuadrant + "]"
    
    // add on new suffix
    if (tagPositionEnd > 0 && tagPositionEnd < task.notes.length - 1) {
      newTaskNotes += task.notes.substring(tagPositionEnd + 1);
    }

    // replace old notes with new
    task.notes = newTaskNotes;
  }

  checkQuadrantMatch(task: ITask, quadrant:string): boolean {
    if (task.title == null || task.title.trim().length == 0) {
      // do not show "empty" tasks
      return false;
    }

    if (task == null || task.notes == null) {
      // declare match with "unspecified" quadrant
      return quadrant == null;
    } else {
      // match up specific quadrants
      if (quadrant == null) {
        return !task.notes.includes("[Quad:");
      } else {
        return task.notes.includes("[Quad:" + quadrant + "]");
      }
    }
  }
}
