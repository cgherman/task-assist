import { ITask } from './itask';

export interface ITaskContainer {
    tasks: ITask[];
    taskCount: number;
}