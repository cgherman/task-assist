import { ITaskList } from './itask-list';

// task list definition (does not contain tasks)
export class FlatTaskList implements ITaskList {
    id = null;
    title = null;

    constructor () {
    }
}