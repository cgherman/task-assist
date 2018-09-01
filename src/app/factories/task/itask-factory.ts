import { ITask } from "../../models/task/itask";
import { ITaskList } from "../../models/task/itask-list";
import { ITasksInList } from "../../models/task/itasks-in-list";
import { ITaskInList } from "../../models/task/itask-in-list";

// ITaskFactory is the basis for strategy
export interface ITaskFactory {
    createTask(): ITask;
    createTaskArray(): ITask[];
    createTaskInList(): ITaskInList;
    createTasksInList(): ITasksInList;
    createTaskList(): ITaskList;
    createTaskLists(): ITaskList[];
}
