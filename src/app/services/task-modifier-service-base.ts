import { ITask } from '../models/itask';

export abstract class TaskModifierServiceBase {
    // modify the task notes to set the quadrant
    abstract setQuadrant(task: ITask, targetQuadrant: string);

    // check the task notes to check for a quadrant match
    abstract checkQuadrantMatch(task: ITask, quadrantChar:string);
}