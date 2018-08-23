import { ITask } from "../../models/task/itask";
import { ITaskInList } from "../../models/task/itask-in-list";
import { ITasksInList } from "../../models/task/itasks-in-list";

export interface ITaskBuilderX {
    createTaskInList(task: ITask, taskListId: string): ITaskInList;
    createTasksInList(tasks: ITask[], taskListId: string): ITasksInList;
}
