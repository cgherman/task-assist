import { Observable, Subject } from 'rxjs';
import { ITaskList } from '../../models/task/itask-list';
import { ITask } from '../../models/task/itask';
import { ITasksInList } from '../../models/task/itasks-in-list';
import { ITaskInListWithState } from '../../models/task/itask-in-list-with-state';

export abstract class TaskServiceBase {
    // event fired upon load error
    public abstract errorLoading: Subject<string>;

    // event fired upon save error
    public abstract errorSaving: Subject<string>;

    // event fired upon task list load
    public abstract taskListsLoaded: Subject<ITaskList[]>;

    // event fired upon task list load
    public abstract tasksLoaded: Subject<ITasksInList>;

    // event fired when authentication is complete
    public abstract taskQuadrantDataEvent: Subject<ITaskInListWithState>;

    // method to fetch task lists (without child task objects)
    public abstract getTaskLists(): Observable<ITaskList[]>;

    // method to fetch tasks for a given task list
    public abstract getTasks(taskListId: string, preferFreshData?: boolean): Observable<ITask[]>;

    // method to get single task
    public abstract getTask(taskId: string, taskListId: string): Observable<ITask>;

    // method to patch/update single task
    public abstract updateTask(task: ITask, taskListId: string): Promise<ITask>;
}