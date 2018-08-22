import { ITaskList } from '../../models/task/itask-list';
import { ITask } from '../../models/task/itask';
import { Observable } from 'rxjs';
import { EventEmitter } from '@angular/core';

export abstract class TaskServiceBase {
    // event fired upon error
    public abstract errorLoadingTasks: EventEmitter<any>;

    // event fired upon task list load
    public abstract taskListsLoaded: EventEmitter<any>;

    // event fired upon task list load
    public abstract tasksLoaded: EventEmitter<any>;

    // method to fetch task lists (without child task objects)
    public abstract getTaskLists(): Observable<ITaskList[]>;

    // method to fetch tasks for a given task list
    public abstract getTasks(taskList: any, preferFreshData?: boolean): Observable<ITask[]>;

    // method to get single task
    public abstract getTask(taskId: string, taskListId: string): Observable<ITask>;

    // method to patch/update single task
    public abstract updateTask(task: ITask, taskListId: string): Promise<ITask>;
}