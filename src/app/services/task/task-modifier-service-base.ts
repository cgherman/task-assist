import { EventEmitter } from '@angular/core';
import { ITask } from '../../models/task/itask';
import { IQuadrantModifierService } from './iquadrant-modifier-service';
import { TaskServiceBase } from './task-service-base';

export abstract class TaskModifierServiceBase implements IQuadrantModifierService<ITask> {
    // modify the task notes to set the quadrant
    abstract setQuadrant(task: ITask, targetQuadrant: string);

    // check the task notes to check for a quadrant match
    abstract checkQuadrantMatch(task: ITask, quadrantChar: string);

    // handle task quadrant update
    abstract updateTaskQuadrant(taskService: TaskServiceBase, taskId: string, taskListId: string, quadrantChar: string);

    // event fired when authentication is complete
    abstract taskQuadrantUpdated: EventEmitter<any>;
}