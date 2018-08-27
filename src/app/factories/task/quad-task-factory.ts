import { TaskInList } from "../../models/task/task-in-list";
import { TasksInList } from "../../models/task/tasks-in-list";
import { ITaskFactory } from "./itask-factory";
import { FlatTaskList } from "../../models/task/flat-task-list";
import { QuadTask } from "../../models/task/quad-task";
import { TaskInListWithState } from "../../models/task/task-in-list-with-state";

export class QuadTaskFactory implements ITaskFactory {

    public createTask(): QuadTask {
        return new QuadTask();
    }

    public createTaskArray(): QuadTask[] {
        var tasks = [] as QuadTask[];
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
