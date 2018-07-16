import { ITaskList } from './models/itask-list';
import { ITask } from './models/itask';
import { Observable } from 'rxjs';

export abstract class TaskServiceBase {
    // method to fetch task lists (without child task objects)
    abstract getTaskLists(subscriber?): Observable<ITaskList[]>;
    
    // method to fetch tasks for a given task list
    abstract getTasks(taskList: any): Observable<ITask[]>;

    abstract getTask(taskId: string, taskListId: string): Observable<ITask>;

    abstract updateTask(task: ITask, taskListId: string): Promise<ITask>;
}