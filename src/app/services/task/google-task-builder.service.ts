import { Injectable } from '@angular/core';

import { ITaskFactory } from "../../factories/task/itask-factory";
import { ITask } from "../../models/task/itask";
import { ITaskInList } from "../../models/task/itask-in-list";
import { ITasksInList } from "../../models/task/itasks-in-list";
import { ITaskList } from "../../models/task/itask-list";
import { TaskConverter } from '../../factories/task/task-converter';
import { QuadTaskStrategy } from '../../factories/task/quad-task-strategy';

@Injectable({
  providedIn: 'root'
})
export class GoogleTaskBuilderService {

    private taskStrategy: ITaskFactory;
    private taskConverter: TaskConverter;

    // Factory can be swapped out for any given factory strategy
    constructor() {
        this.taskStrategy = new QuadTaskStrategy();
        this.taskConverter = new TaskConverter();
    }

    // Create and populate ITaskInList
    public createTaskInList(task: ITask, taskListId: string): ITaskInList {
        return this.populateTaskInList(this.taskStrategy.createTaskInList(), task, taskListId);
    }
    
    private populateTaskInList(taskInList: ITaskInList, task: ITask, taskListId: string) {
        taskInList.task = task;
        taskInList.taskListId = taskListId;
        return taskInList;
    }

    // Parse data into ITaskList[]
    public createTaskLists(gapiClientTaskListArrayResponse: any): ITaskList[] {
        return this.applyGapiClientTaskListArrayResponse(this.taskStrategy.createTaskLists(), gapiClientTaskListArrayResponse);
    }

    private applyGapiClientTaskListArrayResponse(taskLists: ITaskList[], gapiClientTaskListArrayResponse: any) {
        if (gapiClientTaskListArrayResponse.result == null || 
            gapiClientTaskListArrayResponse.result.items == null || 
            gapiClientTaskListArrayResponse.result.items.length == 0) {
            console.log('No Task Lists found.');
        } else {
            console.log('Found ' + gapiClientTaskListArrayResponse.result.items.length + ' Task LISTS.');

            var taskList;
            for (var index = 0; index < gapiClientTaskListArrayResponse.result.items.length; index++) {
                taskList = this.taskStrategy.createTaskList();
                this.applyGapiClientResponse_TaskList(taskList, gapiClientTaskListArrayResponse.result.items[index]);
                taskLists.push(taskList);
            }            
        }

        return taskLists;
    }

    private applyGapiClientResponse_TaskList(taskList: ITaskList, gapiClientResponse_TaskList: any) {
        taskList.id = gapiClientResponse_TaskList.id;
        taskList.title = gapiClientResponse_TaskList.title;
    }

    // Parse data into ITask
    public createTask(gapiClientTaskResponse: any): ITask {
        var task: ITask = this.taskStrategy.createTask();
        this.applyGapiClientResponse_Task(task, gapiClientTaskResponse.result);
        this.taskConverter.decodeRawNotesForQuadTask(task);
        return task;
    }

    // Parse data into ITask[]
    public createTaskArray(gapiClientTaskArrayResponse: any): ITask[] {
        return this.applyGapiClientTaskArrayResponse(this.taskStrategy.createTaskArray(), gapiClientTaskArrayResponse);
    }

    private applyGapiClientTaskArrayResponse(tasks: ITask[], gapiClientTaskArrayResponse: any) {
        if (gapiClientTaskArrayResponse.result == null || 
            gapiClientTaskArrayResponse.result.items == null || 
            gapiClientTaskArrayResponse.result.items.length == 0) {
            console.log('No Tasks found.');
        } else {
            console.log('Found ' + gapiClientTaskArrayResponse.result.items.length + ' TASKS.');

            var task;
            for (var index = 0; index < gapiClientTaskArrayResponse.result.items.length; index++) {
                task = this.taskStrategy.createTask();
                this.applyGapiClientResponse_Task(task, gapiClientTaskArrayResponse.result.items[index]);
                this.taskConverter.decodeRawNotesForQuadTask(task);
                tasks.push(task);
            }
        }

        return tasks;
    }

    private applyGapiClientResponse_Task(task: ITask, gapiClientResponse_Task: any) {
        task.id = gapiClientResponse_Task.id;
        task.title = gapiClientResponse_Task.title;
        task.selfLink = gapiClientResponse_Task.selfLink;
        task.status = gapiClientResponse_Task.status;
        task.notes = gapiClientResponse_Task.notes;
    }

    // Create and populate ITasksInList
    public createTasksInList(tasks: ITask[], taskListId: string): ITasksInList {
        return this.populateTasksInList(this.taskStrategy.createTasksInList(), tasks, taskListId);
    }
    
    private populateTasksInList(tasksInList: ITasksInList, tasks: ITask[], taskListId: string) {
        tasksInList.tasks = tasks;
        tasksInList.taskListId = taskListId;
        return tasksInList;
    }

    public decodeRawNotesForQuadTask(task: ITask) {
        return this.taskConverter.decodeRawNotesForQuadTask(task);
    }

    public setQuadrantForQuadTask(task: ITask, newQuadrantChar: string) {
        return this.taskConverter.setQuadrantForQuadTask(task, newQuadrantChar);
    }

    public encodeRawNotesForQuadTask(task: ITask) {
        return this.taskConverter.encodeRawNotesForQuadTask(task);
    }
}
