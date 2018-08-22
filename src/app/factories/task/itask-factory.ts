import { ITask } from "../../models/task/itask";
import { ITasksInList } from "../../models/task/itasks-in-list";
import { ITaskInList } from "../../models/task/itask-in-list";

export interface ITaskFactory {
    CreateTask(gapiClientTaskListResponse: any): ITask;
    CreateTaskArray(gapiClientTaskListResponse: any): ITask[];
    CreateTaskInList(task: ITask, taskList: string): ITaskInList;
    CreateTasksInList(tasks: ITask[], taskList: string): ITasksInList;
}
