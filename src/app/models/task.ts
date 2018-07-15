import { ITask } from './itask';

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

