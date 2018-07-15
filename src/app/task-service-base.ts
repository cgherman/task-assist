import { ITaskList } from './models/itask-list';
import { ITask } from './models/itask';
import { Observable } from 'rxjs';

export abstract class TaskServiceBase {
    abstract getTaskLists(subscriber?): Observable<ITaskList[]>;
    abstract getTasks(taskList: any): Observable<ITask[]>;
}