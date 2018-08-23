import { ITask } from './itask';
import { ITasksInList } from './itasks-in-list';

// basic task object; could be either a parent or child
export class TasksInList implements ITasksInList {
    public tasks: ITask[] = null;
    public taskListId: string = null;

    constructor () {
    }
}

