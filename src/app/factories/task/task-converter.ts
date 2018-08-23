import { ITask } from "../../models/task/itask";
import { IQuadTask } from "../../models/task/iquad-task";
import { QuadTask } from "../../models/task/quad-task";

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
        var quadrant: number = 0;

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
          quadrant = this.parseNumber(task.notes.substring(tagPositionEnd - 1, tagPositionEnd));
        }

        // modify values
        task.notes = newTaskNotes;
        (task as QuadTask).quadrant = quadrant;
    }

    // encode quadrant information into a generic task
    // modifies task
    public encodeRawNotesForQuadTask(task: ITask) {
      if (!(task instanceof QuadTask)) {
        return;
      }

      var quadNumber: number = (task as QuadTask).quadrant;
      
      var newTaskNotes: string = (task.notes == null ? "" : task.notes + " ");
      newTaskNotes += "[Quad:" + (quadNumber == null ? "0" : quadNumber.toString()) + "]";
      
      (task as QuadTask).notes = newTaskNotes;
    }

    // Set quadrant if object is a QuadTask
    // modifies task
    public setQuadrantForQuadTask(task: ITask, quadrantChar: string) {
      if (!(task instanceof QuadTask)) {
        return;
      }
      
      (task as QuadTask).quadrant = this.parseNumber(quadrantChar);
    }

    private parseNumber(text: string): number {
      var result: number = Number.parseInt(text);
      if (Number.isNaN(result)) {
        return 0
      } else {
        return result;
      }
    }
}
