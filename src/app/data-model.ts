export interface ITaskList {
    id: string;
    title: string;
    tasks: Task[];
}

export class TaskList implements ITaskList {
    id = null;
    title = null;
    tasks: Task[];
    //updated = date...

    constructor (public taskListId: string, title: string) {
        this.id = taskListId;
        this.title = title;
        //this.Task[] = ...
    }
}

export interface ITask {
    id: string;
    title: string;
    selfLink: string;
    status: string;
    notes: string;

    isLeaf(): boolean;
}

export abstract class Task implements ITask {
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

    abstract isLeaf(): boolean;
}

export class RootTask extends Task {
    children: Task[];

    constructor (public taskId: string, title: string, selfLink: string, status: string, notes: string) {
        super(taskId, title, selfLink, status, notes);
        //this.children = childTasks;
    }

    public isLeaf(): boolean {
        return (this.children == null || this.children.length == 0);
    }
}

export class SubTask extends Task {
    public isLeaf(): boolean {
        return true;
    }
}