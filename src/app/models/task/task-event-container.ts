import { ITask } from './itask';

// basic task object; could be either a parent or child
export class TaskEventContainer  {
    task: ITask = null;
    taskListId: string = null;

    constructor (task: ITask, taskListId: string) {
        this.task = task;
        this.taskListId = taskListId;
    }
}

