
import { FlatTask } from "../../models/task/flat-task";
import { TaskInList } from "../../models/task/task-in-list";
import { TasksInList } from "../../models/task/tasks-in-list";
import { ITaskFactory } from "./itask-factory";
import { FlatTaskList } from "../../models/task/flat-task-list";
import { TaskInListWithState } from "../../models/task/task-in-list-with-state";


export class FlatTaskFactory implements ITaskFactory {

    public createTask(): FlatTask {
        return new FlatTask();
    }

    public createTaskArray(): FlatTask[] {
        var tasks = [] as FlatTask[];
        return tasks;
    }
    
    public createTaskInList(): TaskInList {
        return new TaskInList();
    }

    public createTaskInListWithState(): TaskInListWithState {
        return new TaskInListWithState();
    }
    
    public createTasksInList(): TasksInList {
        return new TasksInList();
    }
        
    public createTaskList(): FlatTaskList {
        var taskList = new FlatTaskList();
        return taskList;
    }

    public createTaskLists(): FlatTaskList[] {
        var taskLists = [] as FlatTaskList[];
        return taskLists;
    }
}
