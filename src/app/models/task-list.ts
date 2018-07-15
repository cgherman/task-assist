import { ITaskList } from './itask-list';

export class TaskList implements ITaskList {
    id = null;
    title = null;

    constructor (public taskListId: string, title: string) {
        this.id = taskListId;
        this.title = title;
    }
}