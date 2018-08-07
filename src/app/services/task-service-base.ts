import { ITaskList } from '../models/itask-list';
import { ITask } from '../models/itask';
import { Observable } from 'rxjs';
import { EventEmitter } from '@angular/core';

export abstract class TaskServiceBase {
    // event fired upon error
    abstract errorLoadingTasks: EventEmitter<any>;

    // event fired upon task list load
    abstract taskListLoaded: EventEmitter<any>;

    // method to fetch task lists (without child task objects)
    abstract getTaskLists(): Observable<ITaskList[]>;

    // method to fetch tasks for a given task list
    abstract getTasks(taskList: any): Observable<ITask[]>;

    // method to get single task
    abstract getTask(taskId: string, taskListId: string): Observable<ITask>;

    // method to patch/update single task
    abstract updateTask(task: ITask, taskListId: string): Promise<ITask>;
}