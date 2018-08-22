import { ITaskFactory } from "./itask-factory";
import { ITasksInList } from "../../models/task/itasks-in-list";
import { ITaskInList } from "../../models/task/itask-in-list";
import { ITask } from "../../models/task/itask";
import { ITaskListFactory } from "./itask-list-factory";
import { ITaskList } from "../../models/task/itask-list";

export class TaskFactoryService implements ITaskFactory, ITaskListFactory {

    constructor(private taskFactoryStrategy: ITaskFactory, private taskListFactoryStrategy: ITaskListFactory) {
    }

    public CreateTask(gapiClientTaskListResponse: any): ITask {
        return this.taskFactoryStrategy.CreateTask(gapiClientTaskListResponse);
    }

    public CreateTaskArray(gapiClientTaskListResponse: any): ITask[] {
        return this.taskFactoryStrategy.CreateTaskArray(gapiClientTaskListResponse);
    }

    public CreateTaskInList(task: ITask, taskList: string): ITaskInList {
        return this.taskFactoryStrategy.CreateTaskInList(task, taskList);
    }

    public CreateTasksInList(tasks: ITask[], taskList: string): ITasksInList {
        return this.taskFactoryStrategy.CreateTasksInList(tasks, taskList);
    }

    public CreateTaskLists(gapiClientTaskListResponse: any): ITaskList[] {
        return this.taskListFactoryStrategy.CreateTaskLists(gapiClientTaskListResponse);
    }
}
