import { Observable, Subject } from 'rxjs';
import { ITaskList } from '../../models/task/itask-list';
import { ITask } from '../../models/task/itask';
import { ITasksInList } from '../../models/task/itasks-in-list';

export abstract class TaskServiceBase {
    // event fired upon error
    public abstract errorLoadingTasks: Subject<any>;

    // event fired upon task list load
    public abstract taskListsLoaded: Subject<ITaskList[]>;

    // event fired upon task list load
    public abstract tasksLoaded: Subject<ITasksInList>;

    // method to fetch task lists (without child task objects)
    public abstract getTaskLists(): Observable<ITaskList[]>;

    // method to fetch tasks for a given task list
    public abstract getTasks(taskList: any, preferFreshData?: boolean): Observable<ITask[]>;

    // method to get single task
    public abstract getTask(taskId: string, taskListId: string): Observable<ITask>;

    // method to patch/update single task
    public abstract updateTask(task: ITask, taskListId: string): Promise<ITask>;
}