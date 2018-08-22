import { ITaskList } from "../../models/task/itask-list";

export interface ITaskListFactory {
    CreateTaskLists(gapiClientTaskListResponse: any): ITaskList[];
}
