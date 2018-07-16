import { ITaskList } from './itask-list';

// task list definition (does not contain tasks)
export class TaskList implements ITaskList {
    id = null;
    title = null;

    constructor (public taskListId: string, title: string) {
        this.id = taskListId;
        this.title = title;
    }
}