import { Injectable } from '@angular/core';
import { TaskModifierServiceBase } from './task-modifier-service-base';
import { ITask } from '../models/itask';

@Injectable({
  providedIn: 'root'
})
export class TaskModifierService implements TaskModifierServiceBase {

  constructor() { }

  setQuadrant(task: ITask, targetQuadrant: string) {
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
    newTaskNotes += "[Quad:" + targetQuadrant + "]"
    
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
