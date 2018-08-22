import { ITask } from './itask';
import { ITaskInList } from './itask-in-list';

// basic task object; could be either a parent or child
export class TaskInList implements ITaskInList {
    task: ITask = null;
    taskListId: string = null;

    constructor (task: ITask, taskListId: string) {
        this.task = task;
        this.taskListId = taskListId;
    }
}

