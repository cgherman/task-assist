import { ITask, ITaskList } from './data-model';

export interface ITaskService {
    getTasks(): ITask[];
    getTaskLists(): ITaskList[];
}
