import { ITaskList } from './models/itask-list';
import { ITask } from './models/itask';
import { Observable } from 'rxjs';

export interface ITaskService {
    getTaskLists(subscriber?): Observable<ITaskList[]>;
    getTasks(taskList: any): Observable<ITask[]>;
}

export abstract class TaskServiceBase {
    abstract getTaskLists(subscriber?): Observable<ITaskList[]>;
    abstract getTasks(taskList: any): Observable<ITask[]>;
}