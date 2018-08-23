import { ITask } from '../../models/task/itask';
import { TaskServiceBase } from './task-service-base';
import { Subject } from 'rxjs';

export abstract class TaskModifierServiceBase {

    // handle task quadrant update
    public abstract updateTaskQuadrant(taskService: TaskServiceBase, taskId: string, taskListId: string, quadrantChar: string);

    // event fired when authentication is complete
    public abstract taskQuadrantUpdated: Subject<any>;
}