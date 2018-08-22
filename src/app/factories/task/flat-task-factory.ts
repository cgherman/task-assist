import { ITaskFactory } from "./itask-factory";
import { ITask } from "../../models/task/itask";
import { ITasksInList } from "../../models/task/itasks-in-list";
import { ITaskInList } from "../../models/task/itask-in-list";
import { FlatTask } from "../../models/task/flat-task";
import { TaskInList } from "../../models/task/task-in-list";
import { TasksInList } from "../../models/task/tasks-in-list";

export class FlatTaskFactory implements ITaskFactory{

    public CreateTask(gapiClientTaskListResponse: any): ITask {
        return this.newTask(gapiClientTaskListResponse.result);
    }

    public CreateTaskArray(gapiClientTaskListResponse: any): ITask[] {
        var tasks = [] as FlatTask[];

        for (var index = 0; index < gapiClientTaskListResponse.result.items.length; index++) {
            tasks.push(this.newTask(gapiClientTaskListResponse.result.items[index]));
        }

        return tasks;
    }
    
    public CreateTaskInList(task: ITask, taskList: string): ITaskInList {
        return new TaskInList(task, taskList);
    }
    
    public CreateTasksInList(tasks: ITask[], taskList: string): ITasksInList {
        return new TasksInList(tasks, taskList);
    }
        
    // create a Task from a Google task Resource
    // https://developers.google.com/tasks/v1/reference/tasks#resource
    private newTask(taskResource: any): FlatTask {
        return new FlatTask(taskResource.id,
                        taskResource.title,
                        taskResource.selfLink,
                        taskResource.status,
                        taskResource.notes);
    }
}
