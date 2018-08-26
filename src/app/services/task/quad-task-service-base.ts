import { TaskServiceBase } from './task-service-base';
import { Quadrant } from '../../models/task/quadrant';

export abstract class QuadTaskServiceBase extends TaskServiceBase {
    // handle task quadrant update
    public abstract updateTaskQuadrant(taskId: string, taskListId: string, newQuadrant: Quadrant);
    
    // handle task quadrant update
    public abstract updateTaskQuadrantByChar(taskId: string, taskListId: string, newQuadrantChar: string);
}