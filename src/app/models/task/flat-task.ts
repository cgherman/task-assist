import { ITask } from './itask';

// basic task object; could be either a parent or child
export class FlatTask implements ITask {
    public id: string = null;
    public title: string = null;
    public selfLink: string = null;
    public status: string = null;
    public notes: string = null;

    constructor () {
    }
}