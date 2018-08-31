import { Subject } from "rxjs";
import { ITasksInList } from "../models/task/itasks-in-list";
import { ITaskList } from "../models/task/itask-list";
import { ITaskInListWithState } from "../models/task/itask-in-list-with-state";

export class MockQuadTaskServiceBase {
    public errorLoading: Subject<string> = new Subject();
    public errorSaving: Subject<string> = new Subject();
    public taskListsLoaded: Subject<ITaskList[]> = new Subject();
    public tasksLoaded: Subject<ITasksInList> = new Subject();
    public taskQuadrantDataEvent: Subject<ITaskInListWithState> = new Subject();

}
