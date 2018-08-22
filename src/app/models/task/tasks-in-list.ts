import { ITask } from './itask';
import { ITasksInList } from './itasks-in-list';

// basic task object; could be either a parent or child
export class TasksInList implements ITasksInList {
    tasks: ITask[] = null;
    taskListId: string = null;

    constructor (tasks: ITask[], taskListId: string) {
        this.tasks = tasks;
        this.taskListId = taskListId;
    }
}

