import { ITask } from './itask';

// basic task object; could be either a parent or child
export class Task implements ITask {
    id = null;
    title = null;
    selfLink = null;
    status = null;
    notes = null;

    constructor (public taskId: string, title: string, selfLink: string, status: string, notes: string) {
        this.id = taskId;
        this.title = title;
        this.selfLink = selfLink;
        this.status = status;
        this.notes = notes;
    }
}

