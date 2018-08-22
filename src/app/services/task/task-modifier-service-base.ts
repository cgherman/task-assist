import { ITask } from '../../models/task/itask';
import { IQuadrantModifierService } from './iquadrant-modifier-service';
import { TaskServiceBase } from './task-service-base';
import { Subject } from 'rxjs';

export abstract class TaskModifierServiceBase implements IQuadrantModifierService<ITask> {
    // modify the task notes to set the quadrant
    public abstract setQuadrant(task: ITask, targetQuadrant: string);

    // check the task notes to check for a quadrant match
    public abstract checkQuadrantMatch(task: ITask, quadrantChar: string);

    // handle task quadrant update
    public abstract updateTaskQuadrant(taskService: TaskServiceBase, taskId: string, taskListId: string, quadrantChar: string);

    // event fired when authentication is complete
    public abstract taskQuadrantUpdated: Subject<any>;
}