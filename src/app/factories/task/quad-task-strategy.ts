import { TaskInList } from "../../models/task/task-in-list";
import { TasksInList } from "../../models/task/tasks-in-list";
import { ITaskFactory } from "./itask-factory";
import { FlatTaskList } from "../../models/task/flat-task-list";
import { QuadTask } from "../../models/task/quad-task";
import { QuadTaskFactory } from "./quad-task-factory";
import { TaskConverter } from "./task-converter";

export class QuadTaskStrategy extends QuadTaskFactory {
    private taskConverter: TaskConverter;

    constructor() { 
        super();
        this.taskConverter = new TaskConverter();
    }
}
