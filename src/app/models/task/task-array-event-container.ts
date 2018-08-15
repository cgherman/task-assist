import { ITask } from './itask';

// basic task object; could be either a parent or child
export class TaskArrayEventContainer  {
    tasks: ITask[] = null;
    taskListId: string = null;

    constructor (tasks: ITask[], taskListId: string) {
        this.tasks = tasks;
        this.taskListId = taskListId;
    }
}

