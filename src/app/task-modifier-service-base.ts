import { ITaskList } from './models/itask-list';
import { ITask } from './models/itask';
import { Observable } from 'rxjs';

export abstract class TaskModifierServiceBase {
    abstract setQuadrant(task: ITask, targetQuadrant: string);
}