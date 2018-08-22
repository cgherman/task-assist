import { ITaskFactory } from "./itask-factory";
import { ITasksInList } from "../../models/task/itasks-in-list";
import { ITaskInList } from "../../models/task/itask-in-list";
import { ITask } from "../../models/task/itask";

export class TaskFactoryService implements ITaskFactory{

    constructor(private factoryStrategy: ITaskFactory) {
    }

    public CreateTask(gapiClientTaskListResponse: any): ITask {
        return this.factoryStrategy.CreateTask(gapiClientTaskListResponse);
    }

    public CreateTaskArray(gapiClientTaskListResponse: any): ITask[] {
        return this.factoryStrategy.CreateTaskArray(gapiClientTaskListResponse);
    }

    public CreateTaskInList(task: ITask, taskList: string): ITaskInList {
        return this.factoryStrategy.CreateTaskInList(task, taskList);
    }

    public CreateTasksInList(tasks: ITask[], taskList: string): ITasksInList {
        return this.factoryStrategy.CreateTasksInList(tasks, taskList);
    }
}
