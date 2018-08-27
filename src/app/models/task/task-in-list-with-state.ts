import { TaskInList } from './task-in-list';
import { ITaskInListWithState } from './itask-in-list-with-state';
import { DataState } from './data-state.enum';

// basic task object; could be either a parent or child
export class TaskInListWithState extends TaskInList implements ITaskInListWithState {
    dataState: DataState = DataState.Undefined;

    constructor () {
        super()
    }
}

