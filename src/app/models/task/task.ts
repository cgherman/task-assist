import { ITask } from './itask';

// basic task object; could be either a parent or child
export class Task implements ITask {
    public id: string = null;
    public title: string = null;
    public selfLink: string = null;
    public status: string = null;
    public notes: string = null;

    constructor (public taskId: string, title: string, selfLink: string, status: string, notes: string) {
        this.id = taskId;
        this.title = title;
        this.selfLink = selfLink;
        this.status = status;
        this.notes = notes;
    }
}

