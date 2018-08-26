import { ITask } from "../../models/task/itask";
import { QuadTask } from "../../models/task/quad-task";
import { Quadrant } from "../../models/task/quadrant";

export class TaskConverter {

    constructor() {
    }
    
    // decode quadrant information from a generic task
    // modifies task
    public decodeRawNotesForQuadTask(task: ITask) {
        if (!(task instanceof QuadTask)) {
          return;
        }

        var tagPositionStart: number = -1;
        var tagPositionEnd: number = -1;
        var newTaskNotes: string = "";
        var quadrantChar: string;

        // search for existing "quad" tag in task notes
        if (task.notes != null && task.notes.length > 0) {
          tagPositionStart = task.notes.toUpperCase().indexOf("[QUAD");
        }
    
        // If tag was found then
        if (tagPositionStart >= 0) {
          // find end of tag
          tagPositionEnd = task.notes.toUpperCase().indexOf("]", tagPositionStart);
    
          // if characters exist left of tag then capture them
          if (tagPositionStart > 0) {
            newTaskNotes = task.notes.substring(0, tagPositionStart - 1);
          }
        }
        
        // append post-tag characters
        if (tagPositionEnd > 0 && tagPositionEnd < task.notes.length - 1) {
          newTaskNotes += task.notes.substring(tagPositionEnd + 1);
        }

        if (tagPositionEnd >= 0) {
          quadrantChar = task.notes.substring(tagPositionEnd - 1, tagPositionEnd);
        }

        // modify values
        task.notes = newTaskNotes;
        (task as QuadTask).quadrant.setFromChar(quadrantChar);
    }

    // encode quadrant information into a generic task
    // modifies task
    public encodeRawNotesForQuadTask(task: ITask) {
      if (!(task instanceof QuadTask)) {
        return;
      }

      // encode the value
      var quadrantChar: string = (task as QuadTask).quadrant.selection;
      var newTaskNotes: string = (task.notes == null ? "" : task.notes + " ");
      newTaskNotes += "[Quad:" + quadrantChar + "]";

      // set the notes accordingly
      (task as QuadTask).notes = newTaskNotes;
    }

    // Set quadrant if object is a QuadTask
    // modifies task
    public setQuadrantForQuadTask(task: ITask, newQuadrantChar: string) {
      if (!(task instanceof QuadTask)) {
        return;
      }
      
      (task as QuadTask).quadrant.setFromChar(newQuadrantChar);
    }
}
