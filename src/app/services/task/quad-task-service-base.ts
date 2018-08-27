import { TaskServiceBase } from './task-service-base';
import { Quadrant } from '../../models/task/quadrant';
import { ITask } from '../../models/task/itask';

export abstract class QuadTaskServiceBase extends TaskServiceBase {
    // handle task quadrant update
    public abstract updateTaskQuadrant(taskId: string, taskListId: string, newQuadrant: Quadrant): Promise<ITask>;
    
    // handle task quadrant update
    public abstract updateTaskQuadrantByChar(taskId: string, taskListId: string, newQuadrantChar: string): Promise<ITask>;
}