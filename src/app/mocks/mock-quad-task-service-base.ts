import { Subject } from "rxjs";
import { ITasksInList } from "../models/task/itasks-in-list";
import { ITaskList } from "../models/task/itask-list";
import { ITaskInList } from "../models/task/itask-in-list";

export class MockQuadTaskServiceBase {
    public errorLoading: Subject<string> = new Subject();
    public errorSaving: Subject<string> = new Subject();
    public taskListsLoaded: Subject<ITaskList[]> = new Subject();
    public tasksLoaded: Subject<ITasksInList> = new Subject();
    public taskQuadrantDataEvent: Subject<ITaskInList> = new Subject();
}
