import { ITask } from './itask';
import { ITaskInList } from './itask-in-list';

// basic task object; could be either a parent or child
export class TaskInList implements ITaskInList {
    public task: ITask = null;
    public taskListId: string = null;

    constructor () {
    }
}

